import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth-token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: { email: string; username: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Friends API
export const friendsApi = {
  sendRequest: (receiverUsername: string) =>
    api.post('/friends/request', { receiverUsername }),
  respondToRequest: (requestId: string, action: 'accept' | 'reject') =>
    api.post('/friends/respond', { requestId, action }),
  getFriends: () => api.get('/friends'),
  getRequests: () => api.get('/friends/requests'),
};

// Messages API
export const messagesApi = {
  getMessages: (friendId: string) => api.get(`/messages/${friendId}`),
  sendMessage: (receiverId: string, content: string) =>
    api.post('/messages/send', { receiverId, content }),
  sendImage: (formData: FormData) => {
    return api.post('/messages/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  sendVoiceMessage: (formData: FormData) => {
    return api.post('/messages/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  addReaction: (messageId: string, emoji: string) =>
    api.post('/messages/reaction', { messageId, emoji }),
};