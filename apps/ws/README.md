# 🔌 WebSocket Server

Real-time WebSocket server for instant messaging, typing indicators, and presence updates.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# From the ws directory
npm install
```

### Environment Variables

The WebSocket server uses environment variables from the root `.env` file:

```env
# WebSocket Configuration
WS_PORT=3002

# JWT Secret (for authentication)
JWT_SECRET="your-super-secret-jwt-key"

# Database
DATABASE_URL="file:./dev.db"
```

### Development

```bash
npm run dev
```

The WebSocket server will start on `ws://localhost:3002`

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Folder Structure

```text
apps/ws/
├── src/
│   └── index.ts          # Main WebSocket server
└── package.json
```

## 📡 WebSocket Events

### Client to Server

- `authenticate` - Authenticate user with JWT token
- `message` - Send a chat message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room

### Server to Client

- `authenticated` - Authentication successful
- `message` - New message received
- `typing` - User typing status update
- `user_online` - User came online
- `user_offline` - User went offline
- `friend_request` - New friend request received
- `error` - Error message

## 🔒 Authentication

The WebSocket server authenticates connections using JWT tokens:

1. Client connects to WebSocket
2. Client sends `authenticate` event with JWT token
3. Server verifies token and associates connection with user
4. Server responds with `authenticated` event

Example client authentication:

```javascript
const ws = new WebSocket('ws://localhost:3002');

ws.onopen = () => {
  // Send authentication
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: 'your-jwt-token-here'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'authenticated':
      console.log('Authenticated successfully');
      break;
    case 'message':
      console.log('New message:', data.message);
      break;
    // Handle other events...
  }
};
```

## 💬 Message Flow

### Sending Messages

1. Client sends `message` event with recipient and content
2. Server validates message and saves to database
3. Server broadcasts message to recipient if online
4. Server sends confirmation to sender

### Real-time Features

- **Typing Indicators**: Shows when users are typing
- **Online Status**: Tracks user presence
- **Message Delivery**: Instant message delivery
- **Friend Notifications**: Real-time friend request updates

## 🔧 Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🌐 Connection Management

The server maintains a map of authenticated connections:

```typescript
// Connection storage
const connections = new Map<string, WebSocket>();

// User to connection mapping
const userConnections = new Map<string, string>();
```

### Connection Lifecycle

1. **Connect**: Client connects to WebSocket
2. **Authenticate**: Client provides JWT token
3. **Active**: Connection is ready for real-time events
4. **Disconnect**: Connection is cleaned up

## 🔄 Event Handling

### Message Broadcasting

```typescript
// Send message to specific user
function sendToUser(userId: string, data: any) {
  const connectionId = userConnections.get(userId);
  if (connectionId) {
    const ws = connections.get(connectionId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
}
```

### Room Management

Users are automatically added to rooms based on their friendships for efficient message broadcasting.

## 🚀 Production Deployment

### Scaling Considerations

For production with multiple server instances, consider:

1. **Redis Pub/Sub**: For cross-server message broadcasting
2. **Load Balancer**: Sticky sessions for WebSocket connections
3. **Connection Limits**: Monitor and limit concurrent connections

### Environment Setup

```env
NODE_ENV=production
WS_PORT=3002
JWT_SECRET="secure-random-string"
DATABASE_URL="postgresql://user:password@host:port/database"
```

## 🐛 Common Issues

### Connection Refused

- Check if WebSocket server is running on correct port
- Verify firewall settings
- Ensure client is connecting to correct URL

### Authentication Failures

- Verify JWT token is valid and not expired
- Check JWT_SECRET matches between API and WebSocket servers
- Ensure token is sent in correct format

### Message Delivery Issues

- Check if recipient is online and connected
- Verify database connection for message persistence
- Monitor WebSocket connection states

## 📊 Event Format

All WebSocket messages follow a consistent format:

```json
{
  "type": "event_name",
  "data": { /* event-specific data */ },
  "timestamp": "2023-01-01T00:00:00Z"
}
```

### Example Events

#### Send Message

```json
{
  "type": "message",
  "data": {
    "receiverId": "user-id",
    "content": "Hello!",
    "messageType": "TEXT"
  }
}
```

#### Typing Indicator

```json
{
  "type": "typing_start",
  "data": {
    "userId": "user-id",
    "friendId": "friend-id"
  }
}
```

## 🔍 Debugging

### WebSocket Debugging Tools

- Browser Developer Tools (Network → WS)
- WebSocket test tools (Postman, wscat)
- Server logs for connection events

### Common Debug Steps

1. Check WebSocket connection status in browser dev tools
2. Verify authentication token is valid
3. Monitor server logs for error messages
4. Test with WebSocket debugging tools

## 📈 Performance Monitoring

Key metrics to monitor:

- **Active Connections**: Number of concurrent WebSocket connections
- **Message Throughput**: Messages per second
- **Connection Duration**: Average connection lifetime
- **Memory Usage**: Monitor for connection leaks