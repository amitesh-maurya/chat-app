'use client';

import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
        setIsSidebarOpen(false); // Auto-close sidebar on mobile
      } else if (width < 1024) {
        setScreenSize('tablet');
        setIsSidebarOpen(false); // Auto-close sidebar on tablet
      } else {
        setScreenSize('desktop');
        setIsSidebarOpen(true); // Auto-open sidebar on desktop
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return {
    screenSize,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
  };
};