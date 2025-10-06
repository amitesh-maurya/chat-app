'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/stores/authStore';
import { useChatStore } from '../../lib/stores/chatStore';
import { useResponsive } from '../../lib/hooks/useResponsive';
import { friendsApi, messagesApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { FriendsList } from '../../components/FriendsList';
import { ChatWindow } from '../../components/ChatWindow';
import { FriendRequests } from '../../components/FriendRequests';
import { AddFriendModal } from '../../components/AddFriendModal';
import { ProfileModal } from '../../components/ProfileModal';

import { useWebSocket } from '../../lib/hooks/useWebSocket';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isConnected } = useWebSocket();
  const { isSidebarOpen, toggleSidebar, closeSidebar, isMobile, isDesktop } = useResponsive();
  const { 
    friends, 
    friendRequests, 
    activeChat, 
    setFriends, 
    setFriendRequests,
    setActiveChat,
    setMessages
  } = useChatStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      const [friendsResponse, requestsResponse] = await Promise.all([
        friendsApi.getFriends(),
        friendsApi.getRequests()
      ]);
      
      setFriends(friendsResponse.data.friends);
      setFriendRequests(requestsResponse.data.requests);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [setFriends, setFriendRequests]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    loadInitialData();
  }, [isAuthenticated, router, loadInitialData]);

  const handleSelectFriend = async (friendId: string) => {
    setActiveChat(friendId);
    
    // Close sidebar on mobile when selecting a friend
    if (isMobile) {
      closeSidebar();
    }
    
    try {
      const response = await messagesApi.getMessages(friendId);
      setMessages(friendId, response.data.messages);
    } catch {
      toast.error('Failed to load messages');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Mobile Header - Only visible on mobile */}
      {isMobile && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {activeChat ? (
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Back to friends"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                  title="Toggle sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="font-semibold text-gray-900">
                {activeChat ? friends.find(f => f.id === activeChat)?.username || 'Chat' : 'ChatApp'}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowProfile(true)}
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                title="View Profile"
              >
                {user?.username?.[0]?.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isDesktop ? 'w-1/3' : 'w-80'} 
        ${isMobile ? 'fixed left-0 top-0 h-full z-40' : 'relative'} 
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        bg-white border-r border-gray-200 flex flex-col
        ${isMobile && !activeChat ? 'block' : isMobile && activeChat ? 'hidden' : 'block'}
      `}>
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${isMobile ? 'pt-6' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                title="View Profile"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div className={`${isMobile ? 'block' : 'block'}`}>
                  <h1 className="font-semibold text-gray-900">{user?.username}</h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">Online</p>
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}></div>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddFriend(true)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Add Friend"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              {!isMobile && (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-4">
              <button
                onClick={() => setShowFriendRequests(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !showFriendRequests 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Chats
              </button>
              <button
                onClick={() => setShowFriendRequests(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium relative transition-colors ${
                  showFriendRequests 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Requests
                {friendRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {friendRequests.length}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-all shadow-sm"
              title="Add Friend"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showFriendRequests ? (
            <FriendRequests 
              requests={friendRequests}
              onRequestHandled={loadInitialData}
            />
          ) : (
            <FriendsList 
              friends={friends}
              activeChat={activeChat}
              onSelectFriend={handleSelectFriend}
            />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        flex-1 flex flex-col h-screen
        ${isMobile ? (activeChat ? 'block' : 'hidden') : 'block'}
        ${isMobile ? 'pt-16' : ''}
      `}>
        {activeChat ? (
          <ChatWindow friendId={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to ChatApp</h3>
              <p className="text-gray-500 mb-4">
                {isMobile ? 'Tap a friend to start chatting' : 'Choose a friend from the sidebar to start chatting'}
              </p>
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-sm"
                >
                  View Friends
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      <AddFriendModal 
        isOpen={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onFriendAdded={loadInitialData}
      />
      
      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}