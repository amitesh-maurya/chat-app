'use client';

import { Friend } from '../lib/stores/chatStore';

interface FriendsListProps {
  friends: Friend[];
  activeChat: string | null;
  onSelectFriend: (friendId: string) => void;
}

export function FriendsList({ friends, activeChat, onSelectFriend }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No friends yet.</p>
        <p className="text-sm mt-1">Send friend requests to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {friends.map((friend) => (
        <button
          key={friend.id}
          onClick={() => onSelectFriend(friend.id)}
          className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
            activeChat === friend.id
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm'
              : 'hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-600 font-semibold text-lg shadow-sm">
                {friend.username?.[0]?.toUpperCase() || '?'}
              </div>
              {/* Online status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} title={friend.isOnline ? 'Online' : `Last seen ${friend.lastSeen ? new Date(friend.lastSeen).toLocaleString() : 'recently'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {friend.username}
                  </p>
                  {friend.isOnline && (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Online</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate mt-1">
                {friend.status || 'Hey there! I am using Chat App.'}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}