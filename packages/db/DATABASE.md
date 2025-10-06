# 📊 Database Schema Documentation

This document describes the database schema for the ChatApp application using Prisma ORM with SQLite for development and PostgreSQL for production.

## 🏗️ Schema Overview

The database consists of the following main entities:
- **User** - User accounts and profiles
- **FriendRequest** - Friend request management
- **Friendship** - Established friend relationships
- **Message** - Chat messages with multi-media support
- **MessageReaction** - Emoji reactions to messages

## 📋 Entity Details

### User
Stores user account information and profile data.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String   // Hashed with bcryptjs
  avatar    String?  // Profile picture URL
  status    String?  // User status message
  isOnline  Boolean  @default(false)
  lastSeen  DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Key Features:**
- Unique email and username constraints
- Password is hashed using bcryptjs
- Online status tracking
- Optional profile picture and status message
- Automatic timestamp management

### FriendRequest
Manages friend request flow between users.

```prisma
model FriendRequest {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  status     String   @default("PENDING")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

**Status Values:**
- `PENDING` - Request sent, awaiting response
- `ACCEPTED` - Request accepted, friendship created
- `REJECTED` - Request rejected

### Friendship
Represents established friend relationships.

```prisma
model Friendship {
  id        String   @id @default(cuid())
  user1Id   String
  user2Id   String
  createdAt DateTime @default(now())
}
```

**Key Features:**
- Bidirectional friendship representation
- Automatic timestamp tracking
- Unique constraint on user pairs

### Message
Stores chat messages with support for different message types.

```prisma
model Message {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  content    String   // Text content or file description
  type       String   @default("TEXT") // "TEXT", "IMAGE", "VOICE"
  fileUrl    String?  // URL for uploaded files
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

**Message Types:**
- `TEXT` - Regular text messages
- `IMAGE` - Image attachments
- `VOICE` - Voice messages

**File Handling:**
- Images and voice messages stored in backend uploads folder
- `fileUrl` contains relative path to the file
- `content` can contain description or fallback text

### MessageReaction
Stores emoji reactions to messages.

```prisma
model MessageReaction {
  id        String   @id @default(cuid())
  messageId String
  userId    String
  emoji     String   // Emoji character (e.g., "👍", "❤️")
  createdAt DateTime @default(now())
}
```

**Key Features:**
- One reaction per user per message
- Stores actual emoji characters
- Automatic timestamp tracking

## 🔗 Relationships

### User Relationships
- **Friend Requests**: One-to-many relationship for both sent and received requests
- **Friendships**: Many-to-many through Friendship model
- **Messages**: One-to-many for both sent and received messages
- **Reactions**: One-to-many for message reactions

### Message Relationships
- **Sender/Receiver**: Belongs to User
- **Reactions**: One-to-many with MessageReaction

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd packages/db
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Create Database
```bash
# For development (SQLite)
npx prisma db push

# For production (PostgreSQL)
npx prisma migrate deploy
```

### 4. View Database
```bash
npx prisma studio
```

## 📝 Common Queries

### Get User's Friends
```typescript
const friends = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    friendships1: {
      include: { user2: true }
    },
    friendships2: {
      include: { user1: true }
    }
  }
});
```

### Get Messages Between Users
```typescript
const messages = await prisma.message.findMany({
  where: {
    OR: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id }
    ]
  },
  include: {
    sender: true,
    receiver: true,
    reactions: {
      include: { user: true }
    }
  },
  orderBy: { createdAt: 'asc' }
});
```

### Get Pending Friend Requests
```typescript
const requests = await prisma.friendRequest.findMany({
  where: {
    receiverId: userId,
    status: 'PENDING'
  },
  include: {
    sender: true
  }
});
```

## 🔧 Migrations

### Development
For development, use `db push` to sync schema changes:
```bash
npx prisma db push
```

### Production
For production, create and apply migrations:
```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Apply migrations in production
npx prisma migrate deploy
```

## 🔄 Data Seeding

Create a seed script to populate development data:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'john_doe',
      password: 'hashed_password_here',
      status: 'Hey there! I am using ChatApp.',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'jane_smith',
      password: 'hashed_password_here',
      status: 'Available for chat!',
    },
  });

  // Create friendship
  await prisma.friendship.create({
    data: {
      user1Id: user1.id,
      user2Id: user2.id,
    },
  });

  // Create sample message
  await prisma.message.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
      content: 'Hello! How are you?',
      type: 'TEXT',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:
```bash
npx prisma db seed
```

## 🛡️ Security Considerations

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **Input Validation**: All inputs should be validated before database operations
3. **SQL Injection Prevention**: Prisma provides built-in protection
4. **File Upload Security**: File types and sizes are validated
5. **Access Control**: Users can only access their own data and friends' data

## 📈 Performance Optimizations

1. **Indexes**: Key fields like email, username are automatically indexed
2. **Pagination**: Implement pagination for message lists
3. **Connection Pooling**: Configure connection pool for production
4. **Caching**: Consider Redis for frequently accessed data

## 🔧 Environment Configuration

### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp"
```

### Production (with connection pooling)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/chatapp?connection_limit=10&pool_timeout=20"
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Studio](https://www.prisma.io/studio)
- [Database Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

For questions about the database schema, please refer to the main README.md or create an issue in the repository.