'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import toast from 'react-hot-toast';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { token, isAuthenticated } = useAuthStore();
  const { addMessage, setUserTyping, updateMessage } = useChatStore();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    console.log('WebSocket hook effect triggered:', {
      isAuthenticated,
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    if (!isAuthenticated || !token) {
      console.log('Not authenticated or no token, skipping WebSocket connection');
      setIsConnected(false);
      setRetryCount(0);
      return;
    }

    const connectWebSocket = () => {
      try {
        // Create WebSocket connection
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected to:', WS_URL);
          console.log('Sending authentication with token:', token ? 'TOKEN_EXISTS' : 'NO_TOKEN');
          setIsConnected(true);
          setRetryCount(0); // Reset retry count on successful connection
          // Authenticate
          ws.send(JSON.stringify({
            type: 'AUTH',
            token
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            switch (data.type) {
              case 'AUTH_SUCCESS':
                console.log('WebSocket authenticated');
                break;

              case 'NEW_MESSAGE':
                addMessage(data.message);
                toast.success('New message received');
                break;

              case 'NEW_FRIEND_REQUEST':
                toast.success(`Friend request from ${data.request.sender.username}`);
                break;

              case 'FRIEND_REQUEST_ACCEPTED':
                toast.success('Friend request accepted!');
                // Refresh friends list would be handled by parent component
                break;

              case 'TYPING_START':
                setUserTyping(data.userId, true);
                break;

              case 'TYPING_STOP':
                setUserTyping(data.userId, false);
                break;

              case 'MESSAGE_REACTION':
                if (data.reaction) {
                  // Update message with new reaction
                  updateMessage(data.messageId, {
                    reactions: data.reaction
                  });
                }
                break;

              case 'ERROR':
                console.error('WebSocket error:', data.message);
                toast.error(data.message);
                break;

              default:
                console.log('Unknown WebSocket message:', data);
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setIsConnected(false);
          
          // Only retry if not a normal closure and we haven't exceeded max attempts
          if (event.code !== 1000 && retryCount < MAX_RETRY_ATTEMPTS && isAuthenticated) {
            console.log(`WebSocket connection lost. Retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              connectWebSocket();
            }, RETRY_DELAY);
          } else if (retryCount >= MAX_RETRY_ATTEMPTS) {
            console.error('WebSocket connection failed after maximum retry attempts');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', {
            url: WS_URL,
            readyState: ws.readyState,
            readyStateText: getReadyStateText(ws.readyState),
            error: error,
            timestamp: new Date().toISOString(),
            isAuthenticated,
            hasToken: !!token
          });
          
          // Check if it's a connection error
          if (ws.readyState === WebSocket.CONNECTING) {
            console.error(`Failed to connect to WebSocket server at ${WS_URL}. Make sure the server is running.`);
          }
        };

        const getReadyStateText = (readyState: number) => {
          switch (readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'OPEN';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'CLOSED';
            default: return 'UNKNOWN';
          }
        };

      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, token, addMessage, retryCount, setUserTyping, updateMessage]);

  const sendTypingStart = (friendId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'TYPING_START',
        friendId
      }));
    }
  };

  const sendTypingStop = (friendId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'TYPING_STOP',
        friendId
      }));
    }
  };

  return {
    sendTypingStart,
    sendTypingStop,
    isConnected
  };
}