import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma, redis } from '../index';
import { AuthRequest } from '../middleware/auth';

const router = Router();

const sendFriendRequestSchema = z.object({
  receiverUsername: z.string()
});

const respondToRequestSchema = z.object({
  requestId: z.string(),
  action: z.enum(['accept', 'reject'])
});

// POST /friends/request - Send friend request
router.post('/request', async (req: AuthRequest, res: Response) => {
  try {
    const { receiverUsername } = sendFriendRequestSchema.parse(req.body);
    const senderId = req.userId!;

    // Find receiver
    const receiver = await prisma.user.findUnique({
      where: { username: receiverUsername },
      select: { id: true, username: true }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (receiver.id === senderId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if already friends
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiver.id },
          { user1Id: receiver.id, user2Id: senderId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ error: 'Already friends with this user' });
    }

    // Check if request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId: receiver.id },
          { senderId: receiver.id, receiverId: senderId }
        ],
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId: receiver.id
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        }
      }
    });

    // Notify via Redis (if available)
    if (redis) {
      await redis.publish('friend-request', JSON.stringify({
        type: 'NEW_FRIEND_REQUEST',
        receiverId: receiver.id,
        request: friendRequest
      }));
    }

    res.status(201).json({
      message: 'Friend request sent successfully',
      request: friendRequest
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /friends/respond - Accept/reject friend request
router.post('/respond', async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, action } = respondToRequestSchema.parse(req.body);
    const userId = req.userId!;

    // Find the request
    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        }
      }
    });

    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (action === 'accept') {
      // Update request status and create friendship
      await prisma.$transaction(async (tx: any) => {
        await tx.friendRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' }
        });

        await tx.friendship.create({
          data: {
            user1Id: friendRequest.senderId,
            user2Id: userId
          }
        });
      });

      // Notify via Redis (if available)
      if (redis) {
        await redis.publish('friend-request', JSON.stringify({
          type: 'FRIEND_REQUEST_ACCEPTED',
          senderId: friendRequest.senderId,
          userId: userId
        }));
      }

      res.json({ message: 'Friend request accepted' });
    } else {
      // Reject request
      await prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });

      res.json({ message: 'Friend request rejected' });
    }
  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /friends - Get user's friends
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: {
          select: { id: true, username: true, avatar: true, status: true }
        },
        user2: {
          select: { id: true, username: true, avatar: true, status: true }
        }
      }
    });

    const friends = friendships.map((friendship: any) => {
      return friendship.user1Id === userId ? friendship.user2 : friendship.user1;
    });

    res.json({ friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /friends/requests - Get pending friend requests
router.get('/requests', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ requests });
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;