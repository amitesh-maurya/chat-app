'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useChatStore, Message } from '../lib/stores/chatStore';
import { useAuthStore } from '../lib/stores/authStore';
import { useResponsive } from '../lib/hooks/useResponsive';
import { messagesApi } from '../lib/api';
import { useWebSocket } from '../lib/hooks/useWebSocket';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { EmojiPicker } from './EmojiPicker';
import { VoiceRecorder } from './VoiceRecorder';
import { AudioPlayer } from './AudioPlayer';
import { ImageUpload } from './ImageUpload';

interface ChatWindowProps {
  friendId: string;
}

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏'];

export function ChatWindow({ friendId }: ChatWindowProps) {
  const { user } = useAuthStore();
  const { friends, messages, typingUsers, addMessage } = useChatStore();
  const { sendTypingStart, sendTypingStop } = useWebSocket();
  const { isMobile } = useResponsive();
  
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showMessageEmojiPicker, setShowMessageEmojiPicker] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const friend = friends.find(f => f.id === friendId);
  const chatMessages = messages[friendId] || [];
  const isTyping = typingUsers[friendId];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [friendId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await messagesApi.sendMessage(friendId, messageContent);
      
      // Add the message immediately to local state using the real message from server
      if (response.data?.data) {
        addMessage(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageContent); // Restore message
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicators
    if (e.target.value && !typingTimeout) {
      sendTypingStart(friendId);
    }
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      sendTypingStop(friendId);
      setTypingTimeout(null);
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleEmojiReaction = async (messageId: string, emoji: string) => {
    try {
      await messagesApi.addReaction(messageId, emoji);
      setShowEmojiPicker(null);
      // Reaction will be updated via WebSocket
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowMessageEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleVoiceMessage = async (audioBlob: Blob, duration: number) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('voice', audioBlob, 'voice-message.webm');
      formData.append('receiverId', friendId);
      formData.append('duration', duration.toString());
      
      const response = await messagesApi.sendVoiceMessage(formData);
      if (response.data?.data) {
        addMessage(response.data.data);
      }
      
      toast.success('Voice message sent!');
    } catch (error) {
      console.error('Voice message error:', error);
      toast.error('Failed to send voice message');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('receiverId', friendId);
      
      const response = await messagesApi.sendImage(formData);
      if (response.data?.data) {
        addMessage(response.data.data);
      }
      
      toast.success('Image sent!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to send image');
    }
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const renderMessage = (message: Message) => {
    const isSentByUser = message.senderId === user?.id;
    
    // Debug logging for all messages
    console.log('🔍 Rendering message:', {
      id: message.id,
      type: message.type,
      hasFileUrl: !!message.fileUrl,
      fileUrl: message.fileUrl,
      content: message.content,
      senderId: message.senderId
    });
    
    return (
      <div
        key={message.id}
        className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
          isSentByUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-200 text-gray-900'
        }`}>
          
          {/* Text Message */}
          {(!message.type || message.type === 'text') && (
            <p className="text-sm">{message.content}</p>
          )}
          
          {/* Image Message */}
          {message.type === 'image' && message.fileUrl && (
            <div>
              <Image 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${message.fileUrl}`} 
                alt="Shared image"
                width={300}
                height={200}
                className="max-w-full h-auto rounded-lg mb-2"
                onLoad={() => console.log('✅ Image loaded successfully:', message.fileUrl)}
                onError={(e) => {
                  console.error('❌ Image failed to load:', message.fileUrl);
                  console.error('🔗 Full URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${message.fileUrl}`);
                  console.error('📋 Error details:', e);
                }}
              />
              {message.content && (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
          )}
          
          {/* Debug: Show message type if unknown */}
          {message.type && message.type !== 'text' && message.type !== 'image' && message.type !== 'voice' && (
            <div className="bg-yellow-100 p-2 rounded text-xs">
              Unknown message type: {message.type}
            </div>
          )}
          
          {message.type === 'voice' && message.fileUrl && (
            <div>
              <AudioPlayer 
                audioUrl={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${message.fileUrl}`}
                duration={message.duration || 0}
                className={isSentByUser ? 'bg-primary-400' : 'bg-gray-100'}
              />
              {message.content && (
                <p className="text-sm mt-2">{message.content}</p>
              )}
            </div>
          )}
          
          <p className={`text-xs mt-1 ${
            isSentByUser ? 'text-primary-100' : 'text-gray-500'
          }`}>
            {formatTime(message.createdAt)}
            {message.readAt && isSentByUser && (
              <span className="ml-1">✓✓</span>
            )}
          </p>
          
          {/* Message reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <span
                  key={reaction.id}
                  className="bg-white text-black px-2 py-1 rounded-full text-xs border shadow-sm"
                  title={`${reaction.user.username} reacted with ${reaction.emoji}`}
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          )}
          
          {/* Emoji picker button - Creative Feature */}
          <button
            onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
            className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-600"
            title="Add reaction"
          >
            😊
          </button>
          
          {/* Emoji picker */}
          {showEmojiPicker === message.id && (
            <div className="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="flex gap-1">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiReaction(message.id, emoji)}
                    className="hover:bg-gray-100 rounded p-1 text-sm"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!friend) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Friend not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-h-screen">
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 bg-white shrink-0 ${isMobile ? 'shadow-sm' : ''}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-600 font-semibold shadow-sm">
            {friend.username[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{friend.username}</h2>
            <p className="text-sm text-gray-500">
              {isTyping ? 'typing...' : 'Online'}
            </p>
          </div>
          {isMobile && (
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0 max-h-[calc(100vh-180px)]">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200 relative shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          {/* Attachment Options */}
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => setShowMessageEmojiPicker(!showMessageEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Add emoji"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShowImageUpload(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Attach image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Record voice message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="absolute -top-8 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
                {friend?.username} is typing...
              </div>
            )}
          </div>

          {/* Send Button */}
        <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {/* <span className="text-sm">Sending</span> */}
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                    {/* <span className="text-sm hidden sm:inline">Send</span> */}
                </div>
            )}
        </button>
        </form>

        {/* Emoji Picker */}
        <EmojiPicker
          isOpen={showMessageEmojiPicker}
          onClose={() => setShowMessageEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
        />
      </div>
      
      {/* Voice Recorder Modal */}
      <VoiceRecorder
        isRecording={isRecordingVoice}
        onStartRecording={() => setIsRecordingVoice(true)}
        onStopRecording={() => setIsRecordingVoice(false)}
        onVoiceMessage={handleVoiceMessage}
      />
      
      {/* Image Upload Modal */}
      <ImageUpload
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onImageSelect={handleImageUpload}
      />
    </div>
  );
}