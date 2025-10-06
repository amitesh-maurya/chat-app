import { Router, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma, redis } from '../index';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Debug endpoint to check all messages
router.get('/debug', async (req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        sender: {
          select: { id: true, username: true }
        }
      }
    });
    
    res.json({ 
      count: messages.length,
      messages: messages.map((m: any) => ({
        id: m.id,
        type: m.type,
        hasFileUrl: !!m.fileUrl,
        fileUrl: m.fileUrl,
        content: m.content,
        sender: m.sender.username,
        createdAt: m.createdAt
      }))
    });
  } catch (error) {
    console.error('Debug messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and audio files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed'));
    }
  }
});

const sendMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1).max(1000)
});

const addReactionSchema = z.object({
  messageId: z.string(),
  emoji: z.string()
});

// GET /messages/:friendId - Get messages between users
router.get('/:friendId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const friendId = req.params.friendId;

    // Verify friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: friendId },
          { user1Id: friendId, user2Id: userId }
        ]
      }
    });

    if (!friendship) {
      return res.status(403).json({ error: 'Not friends with this user' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId }
        ]
      },
      include: {
        reactions: {
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 100 // Limit to last 100 messages
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: friendId,
        receiverId: userId,
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /messages/send - Send a message
router.post('/send', async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, content } = sendMessageSchema.parse(req.body);
    const senderId = req.userId!;

    // Verify friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!friendship) {
      return res.status(403).json({ error: 'Not friends with this user' });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        },
        reactions: {
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        }
      }
    });

    // Publish to Redis for real-time delivery (if available)
    if (redis) {
      await redis.publish('new-message', JSON.stringify({
        type: 'NEW_MESSAGE',
        message,
        receiverId
      }));
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /messages/reaction - Add/remove reaction to message
router.post('/reaction', async (req: AuthRequest, res: Response) => {
  try {
    const { messageId, emoji } = addReactionSchema.parse(req.body);
    const userId = req.userId!;

    // Find message and verify user can react to it
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: true,
        receiver: true
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is part of this conversation
    if (message.senderId !== userId && message.receiverId !== userId) {
      return res.status(403).json({ error: 'Not authorized to react to this message' });
    }

    // Check if reaction already exists
    const existingReaction = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId: {
          messageId,
          userId
        }
      }
    });

    let reaction;
    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        // Remove reaction if same emoji
        await prisma.messageReaction.delete({
          where: { id: existingReaction.id }
        });
        reaction = null;
      } else {
        // Update reaction with new emoji
        reaction = await prisma.messageReaction.update({
          where: { id: existingReaction.id },
          data: { emoji },
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        });
      }
    } else {
      // Create new reaction
      reaction = await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji
        },
        include: {
          user: {
            select: { id: true, username: true }
          }
        }
      });
    }

    // Publish reaction update via Redis (if available)
    const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
    if (redis) {
      await redis.publish('message-reaction', JSON.stringify({
        type: 'MESSAGE_REACTION',
        messageId,
        reaction,
        userId: otherUserId
      }));
    }

    res.json({
      message: reaction ? 'Reaction added' : 'Reaction removed',
      reaction
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /messages/image - Send an image message
router.post('/image', upload.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.userId!;
    const { receiverId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!receiverId) {
      return res.status(400).json({ error: 'receiverId is required' });
    }

    // Verify friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!friendship) {
      return res.status(403).json({ error: 'Not friends with this user' });
    }

    // Create file URL (adjust based on your static file serving)
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create image message
    const message = await prisma.message.create({
      data: {
        content: req.body.caption || '', // Optional caption
        type: 'image',
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        senderId,
        receiverId
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        },
        reactions: {
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        }
      }
    });

    // Publish to Redis for real-time delivery (if available)
    if (redis) {
      await redis.publish('new-message', JSON.stringify({
        type: 'NEW_MESSAGE',
        message,
        receiverId
      }));
    }

    res.status(201).json({
      message: 'Image sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /messages/voice - Send a voice message
router.post('/voice', upload.single('voice'), async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.userId!;
    const { receiverId, duration } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No voice file provided' });
    }

    if (!receiverId) {
      return res.status(400).json({ error: 'receiverId is required' });
    }

    // Verify friendship
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    });

    if (!friendship) {
      return res.status(403).json({ error: 'Not friends with this user' });
    }

    // Create file URL
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create voice message
    const message = await prisma.message.create({
      data: {
        content: '', // Voice messages don't have text content
        type: 'voice',
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        duration: duration ? parseInt(duration) : null,
        senderId,
        receiverId
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        },
        reactions: {
          include: {
            user: {
              select: { id: true, username: true }
            }
          }
        }
      }
    });

    // Publish to Redis for real-time delivery (if available)
    if (redis) {
      await redis.publish('new-message', JSON.stringify({
        type: 'NEW_MESSAGE',
        message,
        receiverId
      }));
    }

    res.status(201).json({
      message: 'Voice message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send voice message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;