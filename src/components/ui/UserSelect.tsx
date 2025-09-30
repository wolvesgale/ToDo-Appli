'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { User } from '@/types/database';

interface UserSelectProps {
  value?: string;
  onChange: (userId: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  projectId?: string; // 将来的にプロジェクトメンバーのフィルタリングに使用
}

const UserSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  placeholder = '担当者を選択',
  label,
  error,
  disabled = false,
  className,
  projectId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = React.useId();

  // 選択されたユーザーを取得
  const selectedUser = users.find(user => user.id === value);

  // ユーザー一覧を取得
  const fetchUsers = async (search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      params.append('limit', '20');

      const response = await fetch(`/api/users?${params.toString()}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        }
      }
    } catch (error) {
      console.error('ユーザー一覧取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込み
  useEffect(() => {
    fetchUsers();
  }, []);

  // 検索クエリが変更されたときの処理
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchUsers(searchQuery);
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: User) => {
    onChange(user.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <div
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md cursor-pointer transition-colors',
            'bg-white dark:bg-gray-800',
            'border-gray-300 dark:border-gray-600',
            'hover:border-gray-400 dark:hover:border-gray-500',
            'focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900',
            error && 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500'
          )}
          onClick={handleToggle}
        >
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ユーザーを検索..."
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100"
              disabled={disabled}
            />
          ) : (
            <span className={cn(
              'flex-1 truncate',
              selectedUser ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
            )}>
              {selectedUser ? selectedUser.name : placeholder}
            </span>
          )}
          
          <div className="flex items-center space-x-1">
            {selectedUser && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg
              className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                読み込み中...
              </div>
            ) : users.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'ユーザーが見つかりません' : 'ユーザーがいません'}
              </div>
            ) : (
              <>
                {/* クリアオプション */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full px-3 py-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                >
                  担当者なし
                </button>
                
                {/* ユーザーリスト */}
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserSelect(user)}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                      value === user.id && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default UserSelect;