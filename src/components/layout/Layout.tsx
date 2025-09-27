'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showFooter = true, 
  className = '' 
}) => {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/notifications"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/notifications'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">🔔</span>
              <span>通知</span>
              {/* 未読通知数のバッジ（実際の実装では動的に設定） */}
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
            </Link>
            
            <Link
              href="/invitations"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/invitations'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">📧</span>
              <span>招待</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export { Layout };