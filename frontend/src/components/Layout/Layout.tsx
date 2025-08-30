import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth/');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 p-6 ${isAuthPage ? 'flex items-center justify-center' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
