'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'project_invitation' | 'comment_added' | 'deadline_reminder' | 'project_updated';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  fromUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskTitle?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // モック通知データを読み込み
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'project_invitation',
        title: 'プロジェクトに招待されました',
        message: '田中太郎さんから「ウェブサイトリニューアル」プロジェクトに招待されました。',
        isRead: false,
        createdAt: '2024-01-20T10:30:00Z',
        actionUrl: '/projects/1',
        actionLabel: 'プロジェクトを確認',
        fromUser: {
          id: 'user1',
          name: '田中太郎',
          avatar: '👨‍💼'
        },
        projectId: '1',
        projectName: 'ウェブサイトリニューアル'
      },
      {
        id: '2',
        type: 'task_assigned',
        title: '新しいタスクが割り当てられました',
        message: 'デザインシステムの構築タスクが割り当てられました。',
        isRead: false,
        createdAt: '2024-01-20T09:15:00Z',
        actionUrl: '/projects/1',
        actionLabel: 'タスクを確認',
        fromUser: {
          id: 'user2',
          name: '佐藤花子',
          avatar: '👩‍💻'
        },
        projectId: '1',
        projectName: 'ウェブサイトリニューアル',
        taskId: '2',
        taskTitle: 'デザインシステムの構築'
      },
      {
        id: '3',
        type: 'deadline_reminder',
        title: 'タスクの期限が近づいています',
        message: '「サーバーダウン対応」の期限まで残り1日です。',
        isRead: false,
        createdAt: '2024-01-20T08:00:00Z',
        actionUrl: '/projects/1',
        actionLabel: 'タスクを確認',
        projectId: '1',
        projectName: 'ウェブサイトリニューアル',
        taskId: '1',
        taskTitle: 'サーバーダウン対応'
      },
      {
        id: '4',
        type: 'task_completed',
        title: 'タスクが完了しました',
        message: '鈴木一郎さんが「会議資料の作成」を完了しました。',
        isRead: true,
        createdAt: '2024-01-19T16:45:00Z',
        actionUrl: '/projects/1',
        actionLabel: 'プロジェクトを確認',
        fromUser: {
          id: 'user3',
          name: '鈴木一郎',
          avatar: '👨‍🎨'
        },
        projectId: '1',
        projectName: 'ウェブサイトリニューアル',
        taskId: '3',
        taskTitle: '会議資料の作成'
      },
      {
        id: '5',
        type: 'comment_added',
        title: '新しいコメントが追加されました',
        message: '高橋美咲さんが「デザインシステムの構築」にコメントしました。',
        isRead: true,
        createdAt: '2024-01-19T14:20:00Z',
        actionUrl: '/projects/1',
        actionLabel: 'コメントを確認',
        fromUser: {
          id: 'user4',
          name: '高橋美咲',
          avatar: '👩‍📊'
        },
        projectId: '1',
        projectName: 'ウェブサイトリニューアル',
        taskId: '2',
        taskTitle: 'デザインシステムの構築'
      },
      {
        id: '6',
        type: 'project_updated',
        title: 'プロジェクトが更新されました',
        message: '「ウェブサイトリニューアル」プロジェクトの設定が更新されました。',
        isRead: true,
        createdAt: '2024-01-19T11:30:00Z',
        actionUrl: '/projects/1',
        actionLabel: 'プロジェクトを確認',
        fromUser: {
          id: 'user1',
          name: '田中太郎',
          avatar: '👨‍💼'
        },
        projectId: '1',
        projectName: 'ウェブサイトリニューアル'
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'project_invitation':
        return '📧';
      case 'task_assigned':
        return '📋';
      case 'task_completed':
        return '✅';
      case 'comment_added':
        return '💬';
      case 'deadline_reminder':
        return '⏰';
      case 'project_updated':
        return '🔄';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'project_invitation':
        return 'text-blue-600';
      case 'task_assigned':
        return 'text-green-600';
      case 'task_completed':
        return 'text-emerald-600';
      case 'comment_added':
        return 'text-purple-600';
      case 'deadline_reminder':
        return 'text-red-600';
      case 'project_updated':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));

    // 実際の実装では、ここでAPIを呼び出して既読状態を更新
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));

    // 実際の実装では、ここでAPIを呼び出してすべての通知を既読に
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const handleActionClick = (notification: Notification) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    setShowDetailModal(false);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'たった今';
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}時間前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}日前`;
    
    return date.toLocaleDateString('ja-JP');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">通知を読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                通知
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                プロジェクトやタスクに関する最新の通知を確認しましょう
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                すべて既読にする
              </Button>
            )}
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-2xl">📢</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    全通知
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {notifications.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <span className="text-2xl">🔴</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    未読
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    既読
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {notifications.length - unreadCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルター */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              すべて ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              onClick={() => setFilter('unread')}
              size="sm"
            >
              未読 ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'primary' : 'outline'}
              onClick={() => setFilter('read')}
              size="sm"
            >
              既読 ({notifications.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* 通知一覧 */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {filter === 'unread' ? '未読の通知はありません' : 
                   filter === 'read' ? '既読の通知はありません' : 
                   '通知はありません'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'unread' ? 'すべての通知を確認済みです。' : 
                   filter === 'read' ? 'まだ既読の通知がありません。' : 
                   'プロジェクトやタスクの活動があると、ここに通知が表示されます。'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${!notification.isRead ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                            {!notification.isRead && (
                              <Badge variant="info" size="sm" className="ml-2">
                                新着
                              </Badge>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatRelativeTime(notification.createdAt)}</span>
                            {notification.fromUser && (
                              <span className="flex items-center">
                                <span className="mr-1">{notification.fromUser.avatar}</span>
                                {notification.fromUser.name}
                              </span>
                            )}
                            {notification.projectName && (
                              <span className="flex items-center">
                                📁 {notification.projectName}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 通知詳細モーダル */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="通知詳細"
          size="md"
        >
          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${getNotificationColor(selectedNotification.type)} bg-opacity-10`}>
                  <span className="text-2xl">{getNotificationIcon(selectedNotification.type)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatRelativeTime(selectedNotification.createdAt)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.fromUser && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-2xl">{selectedNotification.fromUser.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedNotification.fromUser.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      送信者
                    </p>
                  </div>
                </div>
              )}

              {(selectedNotification.projectName || selectedNotification.taskTitle) && (
                <div className="space-y-2">
                  {selectedNotification.projectName && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">プロジェクト:</span>
                      <Badge variant="outline">{selectedNotification.projectName}</Badge>
                    </div>
                  )}
                  {selectedNotification.taskTitle && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">タスク:</span>
                      <Badge variant="outline">{selectedNotification.taskTitle}</Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  閉じる
                </Button>
                {selectedNotification.actionUrl && (
                  <Button onClick={() => handleActionClick(selectedNotification)}>
                    {selectedNotification.actionLabel || '確認する'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}