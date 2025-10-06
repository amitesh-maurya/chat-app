'use client';

import { Toaster } from 'react-hot-toast';
import { useWebSocket } from '../lib/hooks/useWebSocket';

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize WebSocket connection
  useWebSocket();

  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}