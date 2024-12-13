import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { SideMenu } from './SideMenu';
import { useAuthStore } from '../../store/useAuthStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="flex relative">
        {user && <SideMenu isMobile={isMobile} />}
        <main className={`flex-1 transition-all duration-200 ${isMobile ? 'w-full' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};