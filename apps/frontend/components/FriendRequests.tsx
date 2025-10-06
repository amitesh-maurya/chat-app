'use client';

import { useState } from 'react';
import { FriendRequest } from '../lib/stores/chatStore';
import { friendsApi } from '../lib/api';
import toast from 'react-hot-toast';

interface FriendRequestsProps {
  requests: FriendRequest[];
  onRequestHandled: () => void;
}

export function FriendRequests({ requests, onRequestHandled }: FriendRequestsProps) {
  const [loadingRequests, setLoadingRequests] = useState<Set<string>>(new Set());

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    setLoadingRequests(prev => new Set(prev).add(requestId));
    
    try {
      await friendsApi.respondToRequest(requestId, action);
      toast.success(`Friend request ${action}ed`);
      onRequestHandled();
    } catch (_error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setLoadingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  if (requests.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="font-medium">No pending friend requests</p>
        <p className="text-sm mt-1">New requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {requests.map((request) => (
        <div key={request.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-600 font-semibold shadow-sm">
                {request.sender.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {request.sender.username}
                </p>
                <p className="text-xs text-gray-500">
                  Sent a friend request
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleRequest(request.id, 'accept')}
                disabled={loadingRequests.has(request.id)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept
              </button>
              <button
                onClick={() => handleRequest(request.id, 'reject')}
                disabled={loadingRequests.has(request.id)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}