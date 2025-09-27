'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal, Input, Select } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';

interface Invitation {
  id: string;
  type: 'sent' | 'received';
  projectId: string;
  projectName: string;
  projectDescription?: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt: string;
  expiresAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export default function InvitationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'pending'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // モック招待データを読み込み
    const mockInvitations: Invitation[] = [
      {
        id: '1',
        type: 'received',
        projectId: '1',
        projectName: 'ウェブサイトリニューアル',
        projectDescription: 'コーポレートサイトの全面リニューアルプロジェクト',
        fromUser: {
          id: 'user1',
          name: '田中太郎',
          email: 'tanaka@example.com',
          avatar: '👨‍💼'
        },
        toUser: {
          id: 'current-user',
          name: 'あなた',
          email: 'you@example.com',
          avatar: '👤'
        },
        role: 'member',
        status: 'pending',
        message: 'ウェブサイトリニューアルプロジェクトにご参加いただけませんか？あなたのスキルが必要です。',
        createdAt: '2024-01-20T10:30:00Z',
        expiresAt: '2024-01-27T10:30:00Z'
      },
      {
        id: '2',
        type: 'received',
        projectId: '2',
        projectName: 'モバイルアプリ開発',
        projectDescription: 'iOS/Androidアプリの新規開発',
        fromUser: {
          id: 'user2',
          name: '佐藤花子',
          email: 'sato@example.com',
          avatar: '👩‍💻'
        },
        toUser: {
          id: 'current-user',
          name: 'あなた',
          email: 'you@example.com',
          avatar: '👤'
        },
        role: 'admin',
        status: 'pending',
        message: 'モバイルアプリ開発プロジェクトの管理者として参加していただきたいです。',
        createdAt: '2024-01-19T15:20:00Z',
        expiresAt: '2024-01-26T15:20:00Z'
      },
      {
        id: '3',
        type: 'sent',
        projectId: '3',
        projectName: 'マーケティング戦略',
        projectDescription: '2024年度マーケティング戦略の策定',
        fromUser: {
          id: 'current-user',
          name: 'あなた',
          email: 'you@example.com',
          avatar: '👤'
        },
        toUser: {
          id: 'user3',
          name: '鈴木一郎',
          email: 'suzuki@example.com',
          avatar: '👨‍🎨'
        },
        role: 'member',
        status: 'accepted',
        message: 'マーケティング戦略プロジェクトにご参加ください。',
        createdAt: '2024-01-18T09:45:00Z',
        expiresAt: '2024-01-25T09:45:00Z'
      },
      {
        id: '4',
        type: 'sent',
        projectId: '3',
        projectName: 'マーケティング戦略',
        projectDescription: '2024年度マーケティング戦略の策定',
        fromUser: {
          id: 'current-user',
          name: 'あなた',
          email: 'you@example.com',
          avatar: '👤'
        },
        toUser: {
          id: 'user4',
          name: '高橋美咲',
          email: 'takahashi@example.com',
          avatar: '👩‍📊'
        },
        role: 'viewer',
        status: 'declined',
        message: 'マーケティング戦略の確認をお願いします。',
        createdAt: '2024-01-17T14:30:00Z',
        expiresAt: '2024-01-24T14:30:00Z'
      },
      {
        id: '5',
        type: 'sent',
        projectId: '4',
        projectName: 'システム改善',
        projectDescription: '既存システムの改善・最適化',
        fromUser: {
          id: 'current-user',
          name: 'あなた',
          email: 'you@example.com',
          avatar: '👤'
        },
        toUser: {
          id: 'user5',
          name: '山田次郎',
          email: 'yamada@example.com',
          avatar: '👨‍🔧'
        },
        role: 'admin',
        status: 'pending',
        message: 'システム改善プロジェクトの管理をお願いします。',
        createdAt: '2024-01-16T11:15:00Z',
        expiresAt: '2024-01-23T11:15:00Z'
      }
    ];

    const mockProjects: Project[] = [
      {
        id: '3',
        name: 'マーケティング戦略',
        description: '2024年度マーケティング戦略の策定',
        memberCount: 5
      },
      {
        id: '4',
        name: 'システム改善',
        description: '既存システムの改善・最適化',
        memberCount: 3
      },
      {
        id: '5',
        name: 'プロダクト開発',
        description: '新プロダクトの企画・開発',
        memberCount: 8
      }
    ];

    setTimeout(() => {
      setInvitations(mockInvitations);
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const getStatusColor = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'accepted':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'declined':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'expired':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusText = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return '保留中';
      case 'accepted':
        return '承認済み';
      case 'declined':
        return '拒否';
      case 'expired':
        return '期限切れ';
      default:
        return '不明';
    }
  };

  const getRoleText = (role: Invitation['role']) => {
    switch (role) {
      case 'owner':
        return 'オーナー';
      case 'admin':
        return '管理者';
      case 'member':
        return 'メンバー';
      case 'viewer':
        return '閲覧者';
      default:
        return '不明';
    }
  };

  const filteredInvitations = invitations.filter(invitation => {
    switch (filter) {
      case 'sent':
        return invitation.type === 'sent';
      case 'received':
        return invitation.type === 'received';
      case 'pending':
        return invitation.status === 'pending';
      default:
        return true;
    }
  });

  const pendingReceivedCount = invitations.filter(i => i.type === 'received' && i.status === 'pending').length;
  const sentCount = invitations.filter(i => i.type === 'sent').length;
  const receivedCount = invitations.filter(i => i.type === 'received').length;

  const handleAcceptInvitation = async (invitationId: string) => {
    setInvitations(prev => prev.map(invitation => 
      invitation.id === invitationId 
        ? { ...invitation, status: 'accepted' as const }
        : invitation
    ));

    // 実際の実装では、ここでAPIを呼び出して招待を承認
    console.log('招待を承認しました:', invitationId);
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setInvitations(prev => prev.map(invitation => 
      invitation.id === invitationId 
        ? { ...invitation, status: 'declined' as const }
        : invitation
    ));

    // 実際の実装では、ここでAPIを呼び出して招待を拒否
    console.log('招待を拒否しました:', invitationId);
  };

  const handleSendInvitation = async () => {
    if (!selectedProject || !inviteEmail) return;

    setSending(true);

    // 実際の実装では、ここでAPIを呼び出して招待を送信
    const newInvitation: Invitation = {
      id: Date.now().toString(),
      type: 'sent',
      projectId: selectedProject,
      projectName: projects.find(p => p.id === selectedProject)?.name || '',
      projectDescription: projects.find(p => p.id === selectedProject)?.description,
      fromUser: {
        id: 'current-user',
        name: 'あなた',
        email: 'you@example.com',
        avatar: '👤'
      },
      toUser: {
        id: 'new-user',
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        avatar: '👤'
      },
      role: inviteRole,
      status: 'pending',
      message: inviteMessage,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    setTimeout(() => {
      setInvitations(prev => [newInvitation, ...prev]);
      setShowInviteModal(false);
      setSelectedProject('');
      setInviteEmail('');
      setInviteRole('member');
      setInviteMessage('');
      setSending(false);
    }, 1000);

    console.log('招待を送信しました:', newInvitation);
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

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">招待を読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                招待管理
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                プロジェクトの招待を送信・管理しましょう
              </p>
            </div>
            <Button onClick={() => setShowInviteModal(true)}>
              招待を送信
            </Button>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-2xl">📧</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    全招待
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {invitations.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <span className="text-2xl">📤</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    送信済み
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {sentCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-2xl">📥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    受信済み
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {receivedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-2xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    要対応
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingReceivedCount}
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
              すべて ({invitations.length})
            </Button>
            <Button
              variant={filter === 'received' ? 'primary' : 'outline'}
              onClick={() => setFilter('received')}
              size="sm"
            >
              受信 ({receivedCount})
            </Button>
            <Button
              variant={filter === 'sent' ? 'primary' : 'outline'}
              onClick={() => setFilter('sent')}
              size="sm"
            >
              送信 ({sentCount})
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              保留中 ({invitations.filter(i => i.status === 'pending').length})
            </Button>
          </div>
        </div>

        {/* 招待一覧 */}
        <div className="space-y-4">
          {filteredInvitations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  招待がありません
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'sent' ? 'まだ招待を送信していません。' : 
                   filter === 'received' ? 'まだ招待を受信していません。' : 
                   filter === 'pending' ? '保留中の招待はありません。' : 
                   'まだ招待がありません。'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInvitations.map((invitation) => (
              <Card key={invitation.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <span className="text-xl">
                            {invitation.type === 'sent' ? '📤' : '📥'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {invitation.projectName}
                          </h3>
                          <Badge className={getStatusColor(invitation.status)}>
                            {getStatusText(invitation.status)}
                          </Badge>
                          {isExpired(invitation.expiresAt) && invitation.status === 'pending' && (
                            <Badge variant="danger">期限切れ</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {invitation.projectDescription}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            <span>{invitation.type === 'sent' ? invitation.toUser.avatar : invitation.fromUser.avatar}</span>
                            <span>
                              {invitation.type === 'sent' ? '送信先: ' : '送信者: '}
                              {invitation.type === 'sent' ? invitation.toUser.name : invitation.fromUser.name}
                            </span>
                          </div>
                          <span>役割: {getRoleText(invitation.role)}</span>
                          <span>{formatRelativeTime(invitation.createdAt)}</span>
                        </div>

                        {invitation.message && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              "{invitation.message}"
                            </p>
                          </div>
                        )}

                        {invitation.type === 'received' && invitation.status === 'pending' && !isExpired(invitation.expiresAt) && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptInvitation(invitation.id)}
                            >
                              承認
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeclineInvitation(invitation.id)}
                            >
                              拒否
                            </Button>
                          </div>
                        )}

                        {invitation.status === 'accepted' && (
                          <Link href={`/projects/${invitation.projectId}`}>
                            <Button variant="outline" size="sm">
                              プロジェクトを確認
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 招待送信モーダル */}
        <Modal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          title="プロジェクトに招待"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                プロジェクト
              </label>
              <Select
                options={projects.map(project => ({
                  value: project.id,
                  label: `${project.name} (${project.memberCount}人)`
                }))}
                value={selectedProject}
                onChange={setSelectedProject}
                placeholder="プロジェクトを選択"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                招待するメールアドレス
              </label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="example@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                役割
              </label>
              <Select
                options={[
                  { value: 'admin', label: '管理者 - プロジェクトの管理権限' },
                  { value: 'member', label: 'メンバー - タスクの作成・編集権限' },
                  { value: 'viewer', label: '閲覧者 - 閲覧のみ' }
                ]}
                value={inviteRole}
                onChange={(value: string) => setInviteRole(value as 'admin' | 'member' | 'viewer')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                メッセージ（任意）
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                value={inviteMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInviteMessage(e.target.value)}
                placeholder="招待メッセージを入力してください..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
                disabled={sending}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSendInvitation}
                disabled={!selectedProject || !inviteEmail || sending}
              >
                {sending ? '送信中...' : '招待を送信'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}