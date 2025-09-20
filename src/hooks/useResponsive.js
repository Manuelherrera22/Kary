import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState('sm');

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial size
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const width = screenSize.width;
    
    if (width < 640) {
      setBreakpoint('xs');
    } else if (width < 768) {
      setBreakpoint('sm');
    } else if (width < 1024) {
      setBreakpoint('md');
    } else if (width < 1280) {
      setBreakpoint('lg');
    } else if (width < 1536) {
      setBreakpoint('xl');
    } else {
      setBreakpoint('2xl');
    }
  }, [screenSize.width]);

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl';
  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md';

  return {
    screenSize,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
  };
};

export default useResponsive;
