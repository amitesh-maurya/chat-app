import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@chat-app/db';

const port = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 3002;

// Initialize clients
const prisma = new PrismaClient();

// Initialize Redis Client (optional for development)
let redis: any = null;

async function initRedis() {
  try {
    redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redis.connect();
    console.log('Connected to Redis');
    return true;
  } catch (error) {
    console.log('Redis not available - WebSocket will work without real-time pub/sub');
    redis = null;
    return false;
  }
}

// Store active connections
interface UserConnection {
  userId: string;
  username: string;
  ws: WebSocket;
}

const activeConnections = new Map<string, UserConnection>();

// Initialize WebSocket server
const wss = new WebSocketServer({ port });

console.log(`WebSocket server running on port ${port}`);

// Handle new connections
wss.on('connection', async (ws: WebSocket, req) => {
  console.log('New WebSocket connection');

  // Authentication
  let userConnection: UserConnection | null = null;

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'AUTH') {
        // Authenticate user
        const token = message.token;
        console.log('Received AUTH message. Token exists:', !!token);
        console.log('Token preview (first 20 chars):', token ? token.substring(0, 20) + '...' : 'NO_TOKEN');
        
        if (!token) {
          console.log('No token provided, closing connection');
          ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Authentication token required'
          }));
          return ws.close();
        }

        try {
          console.log('Attempting to verify JWT token');
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
          console.log('JWT verified successfully for user:', decoded.userId);
          
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true }
          });

          if (!user) {
            console.log('User not found in database');
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Invalid token'
            }));
            return ws.close();
          }

          // Store connection
          userConnection = {
            userId: user.id,
            username: user.username,
            ws
          };

          activeConnections.set(user.id, userConnection);

          ws.send(JSON.stringify({
            type: 'AUTH_SUCCESS',
            message: 'Authentication successful'
          }));

          console.log(`User ${user.username} connected successfully`);

        } catch (error) {
          console.log('JWT verification failed:', error);
          ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Invalid token'
          }));
          return ws.close();
        }
      }

      if (message.type === 'TYPING_START' && userConnection) {
        // Broadcast typing indicator
        const { friendId } = message;
        const friendConnection = activeConnections.get(friendId);
        
        if (friendConnection) {
          friendConnection.ws.send(JSON.stringify({
            type: 'TYPING_START',
            userId: userConnection.userId,
            username: userConnection.username
          }));
        }
      }

      if (message.type === 'TYPING_STOP' && userConnection) {
        // Stop typing indicator
        const { friendId } = message;
        const friendConnection = activeConnections.get(friendId);
        
        if (friendConnection) {
          friendConnection.ws.send(JSON.stringify({
            type: 'TYPING_STOP',
            userId: userConnection.userId
          }));
        }
      }

    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    if (userConnection) {
      activeConnections.delete(userConnection.userId);
      console.log(`User ${userConnection.username} disconnected`);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Redis subscribers for real-time events
async function setupRedisSubscribers() {
  if (!redis) {
    console.log('Skipping Redis subscribers - Redis not available');
    return;
  }

  const subscriber = redis.duplicate();
  await subscriber.connect();

  // Subscribe to new messages
  await subscriber.subscribe('new-message', (message: string) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'NEW_MESSAGE') {
        const receiverConnection = activeConnections.get(data.receiverId);
        
        if (receiverConnection) {
          receiverConnection.ws.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            message: data.message
          }));
        }
      }
    } catch (error) {
      console.error('Redis new-message error:', error);
    }
  });

  // Subscribe to friend requests
  await subscriber.subscribe('friend-request', (message: string) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'NEW_FRIEND_REQUEST') {
        const receiverConnection = activeConnections.get(data.receiverId);
        
        if (receiverConnection) {
          receiverConnection.ws.send(JSON.stringify({
            type: 'NEW_FRIEND_REQUEST',
            request: data.request
          }));
        }
      }

      if (data.type === 'FRIEND_REQUEST_ACCEPTED') {
        const senderConnection = activeConnections.get(data.senderId);
        
        if (senderConnection) {
          senderConnection.ws.send(JSON.stringify({
            type: 'FRIEND_REQUEST_ACCEPTED',
            userId: data.userId
          }));
        }
      }
    } catch (error) {
      console.error('Redis friend-request error:', error);
    }
  });

  // Subscribe to message reactions
  await subscriber.subscribe('message-reaction', (message: string) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'MESSAGE_REACTION') {
        const userConnection = activeConnections.get(data.userId);
        
        if (userConnection) {
          userConnection.ws.send(JSON.stringify({
            type: 'MESSAGE_REACTION',
            messageId: data.messageId,
            reaction: data.reaction
          }));
        }
      }
    } catch (error) {
      console.error('Redis message-reaction error:', error);
    }
  });

  console.log('Redis subscribers initialized');
}

// Start server
async function startServer() {
  try {
    await initRedis();
    await setupRedisSubscribers();
    
    console.log('WebSocket server ready');
  } catch (error) {
    console.error('Failed to start WebSocket server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down WebSocket server...');
  
  // Close all WebSocket connections
  activeConnections.forEach((connection) => {
    connection.ws.close();
  });
  
  await prisma.$disconnect();
  if (redis) await redis.quit();
  
  wss.close(() => {
    console.log('WebSocket server shut down');
    process.exit(0);
  });
});

startServer();