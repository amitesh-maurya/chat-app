import { create } from 'zustand';

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface FriendRequest {
  id: string;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  type?: string; // 'text', 'image', 'voice', 'file'
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // for voice messages
  senderId: string;
  receiverId: string;
  createdAt: string;
  readAt?: string;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  user: {
    id: string;
    username: string;
  };
}

interface ChatState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  messages: Record<string, Message[]>; // friendId -> messages
  activeChat: string | null;
  onlineUsers: Set<string>;
  typingUsers: Record<string, boolean>; // friendId -> isTyping
  
  setFriends: (friends: Friend[]) => void;
  setFriendRequests: (requests: FriendRequest[]) => void;
  addFriend: (friend: Friend) => void;
  removeFriendRequest: (requestId: string) => void;
  setMessages: (friendId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setActiveChat: (friendId: string | null) => void;
  setUserOnline: (userId: string, online: boolean) => void;
  setUserTyping: (friendId: string, typing: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  friends: [],
  friendRequests: [],
  messages: {},
  activeChat: null,
  onlineUsers: new Set(),
  typingUsers: {},

  setFriends: (friends) => set({ friends }),
  
  setFriendRequests: (requests) => set({ friendRequests: requests }),
  
  addFriend: (friend) => set((state) => ({
    friends: [...state.friends, friend]
  })),
  
  removeFriendRequest: (requestId) => set((state) => ({
    friendRequests: state.friendRequests.filter(req => req.id !== requestId)
  })),
  
  setMessages: (friendId, messages) => set((state) => ({
    messages: { ...state.messages, [friendId]: messages }
  })),
  
  addMessage: (message) => {
    set((state) => {
      // For messages, we need to determine which friend this conversation is with
      // The friendId is whoever is NOT the current user in the conversation
      let friendId: string;
      
      // If we have an active chat, use that
      if (state.activeChat) {
        friendId = state.activeChat;
      } else {
        // Otherwise, determine from the message participants
        // The friend is the other person in the conversation (not the sender if it's us)
        friendId = message.senderId === message.receiverId 
          ? message.senderId // Self-message case (unlikely)
          : (message.senderId !== state.activeChat ? message.senderId : message.receiverId);
      }
      
      const existingMessages = state.messages[friendId] || [];
      
      // Avoid adding duplicate messages
      const messageExists = existingMessages.some(m => m.id === message.id);
      if (messageExists) {
        return state;
      }
      
      return {
        messages: {
          ...state.messages,
          [friendId]: [...existingMessages, message]
        }
      };
    });
  },
  
  updateMessage: (messageId, updates) => set((state) => {
    const newMessages = { ...state.messages };
    
    Object.keys(newMessages).forEach(friendId => {
      newMessages[friendId] = (newMessages[friendId] || []).map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );
    });
    
    return { messages: newMessages };
  }),
  
  setActiveChat: (friendId) => set({ activeChat: friendId }),
  
  setUserOnline: (userId, online) => set((state) => {
    const newOnlineUsers = new Set(state.onlineUsers);
    if (online) {
      newOnlineUsers.add(userId);
    } else {
      newOnlineUsers.delete(userId);
    }
    return { onlineUsers: newOnlineUsers };
  }),
  
  setUserTyping: (friendId, typing) => set((state) => ({
    typingUsers: { ...state.typingUsers, [friendId]: typing }
  }))
}));