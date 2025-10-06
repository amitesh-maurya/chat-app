export * from '@prisma/client';
export { PrismaClient } from '@prisma/client';

// Re-export useful types
export type {
  User,
  FriendRequest,
  Friendship,
  Message,
  MessageReaction
} from '@prisma/client';