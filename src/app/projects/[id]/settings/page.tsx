'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, Badge, Modal } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  visibility: 'private' | 'public';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  avatar?: string;
}

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ProjectMember['role']>('member');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectId = params.id as string;

  const colorOptions = [
    { value: '#3B82F6', label: 'ブルー', color: '#3B82F6' },
    { value: '#10B981', label: 'グリーン', color: '#10B981' },
    { value: '#F59E0B', label: 'オレンジ', color: '#F59E0B' },
    { value: '#8B5CF6', label: 'パープル', color: '#8B5CF6' },
    { value: '#EF4444', label: 'レッド', color: '#EF4444' },
    { value: '#6B7280', label: 'グレー', color: '#6B7280' }
  ];

  const roleLabels = {
    owner: 'オーナー',
    admin: '管理者',
    member: 'メンバー',
    viewer: '閲覧者'
  };

  const roleDescriptions = {
    owner: 'プロジェクトの完全な管理権限',
    admin: 'メンバー管理とプロジェクト設定の変更',
    member: 'タスクの作成・編集・削除',
    viewer: '閲覧のみ'
  };

  useEffect(() => {
    // 認証状態の読み込み中は何もしない
    if (authLoading) {
      return;
    }
    
    // 読み込み完了後、認証されていない場合のみリダイレクト
    if (!isAuthenticated) {
      console.log('🚫 認証されていません。ログインページにリダイレクトします');
      router.push('/auth/login');
      return;
    }
    
    console.log('✅ 認証済みユーザー:', user);

    // モックデータを読み込み
    const mockProject: Project = {
      id: projectId,
      name: 'ウェブサイトリニューアル',
      description: 'コーポレートサイトの全面リニューアルプロジェクト',
      color: '#3B82F6',
      visibility: 'private',
      createdBy: 'user1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    };

    const mockMembers: ProjectMember[] = [
      {
        id: '1',
        userId: 'user1',
        userName: '田中太郎',
        userEmail: 'tanaka@example.com',
        role: 'owner',
        joinedAt: '2024-01-15T10:00:00Z',
        avatar: '👨‍💼'
      },
      {
        id: '2',
        userId: 'user2',
        userName: '佐藤花子',
        userEmail: 'sato@example.com',
        role: 'admin',
        joinedAt: '2024-01-16T09:00:00Z',
        avatar: '👩‍💻'
      },
      {
        id: '3',
        userId: 'user3',
        userName: '鈴木一郎',
        userEmail: 'suzuki@example.com',
        role: 'member',
        joinedAt: '2024-01-17T14:00:00Z',
        avatar: '👨‍🎨'
      },
      {
        id: '4',
        userId: 'user4',
        userName: '高橋美咲',
        userEmail: 'takahashi@example.com',
        role: 'viewer',
        joinedAt: '2024-01-18T11:00:00Z',
        avatar: '👩‍📊'
      }
    ];

    setTimeout(() => {
      setProject(mockProject);
      setMembers(mockMembers);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, authLoading, user, router, projectId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!project?.name.trim()) {
      newErrors.name = 'プロジェクト名は必須です';
    } else if (project.name.length > 100) {
      newErrors.name = 'プロジェクト名は100文字以内で入力してください';
    }

    if (project?.description && project.description.length > 500) {
      newErrors.description = '説明は500文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!project || !validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // 実際の実装では、ここでAPIを呼び出してプロジェクトを更新
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('プロジェクト更新:', project);
      
      // 成功メッセージを表示（実際の実装では適切な通知システムを使用）
      alert('プロジェクトが更新されました');
    } catch (error) {
      console.error('プロジェクト更新エラー:', error);
      setErrors({ submit: 'プロジェクトの更新に失敗しました。もう一度お試しください。' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      // 実際の実装では、ここでAPIを呼び出してプロジェクトを削除
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('プロジェクト削除:', projectId);
      
      // プロジェクト一覧ページにリダイレクト
      router.push('/projects');
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
      alert('プロジェクトの削除に失敗しました。もう一度お試しください。');
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      return;
    }

    try {
      // 実際の実装では、ここでAPIを呼び出して招待を送信
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newMember: ProjectMember = {
        id: Date.now().toString(),
        userId: `user_${Date.now()}`,
        userName: inviteEmail.split('@')[0],
        userEmail: inviteEmail,
        role: inviteRole,
        joinedAt: new Date().toISOString(),
        avatar: '👤'
      };

      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setInviteRole('member');
      setShowInviteModal(false);

      alert('招待を送信しました');
    } catch (error) {
      console.error('メンバー招待エラー:', error);
      alert('招待の送信に失敗しました。もう一度お試しください。');
    }
  };

  const handleRoleChange = async (memberId: string, newRole: ProjectMember['role']) => {
    try {
      // 実際の実装では、ここでAPIを呼び出して権限を更新
      await new Promise(resolve => setTimeout(resolve, 500));

      setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));

      console.log('権限更新:', { memberId, newRole });
    } catch (error) {
      console.error('権限更新エラー:', error);
      alert('権限の更新に失敗しました。もう一度お試しください。');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('このメンバーをプロジェクトから削除しますか？')) {
      return;
    }

    try {
      // 実際の実装では、ここでAPIを呼び出してメンバーを削除
      await new Promise(resolve => setTimeout(resolve, 500));

      setMembers(prev => prev.filter(member => member.id !== memberId));

      console.log('メンバー削除:', memberId);
    } catch (error) {
      console.error('メンバー削除エラー:', error);
      alert('メンバーの削除に失敗しました。もう一度お試しください。');
    }
  };

  const currentUserMember = members.find(m => m.userId === user?.id);
  const canManageProject = currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin';
  const isOwner = currentUserMember?.role === 'owner';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">設定を読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              プロジェクトが見つかりません
            </h1>
            <Link href="/projects">
              <Button>プロジェクト一覧に戻る</Button>
            </Link>
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
          <div className="flex items-center mb-4">
            <Link href={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-500 mr-2">
              ← プロジェクト詳細
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            プロジェクト設定
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            プロジェクトの基本情報とメンバーを管理します
          </p>
        </div>

        <div className="space-y-8">
          {/* 基本設定 */}
          <Card>
            <CardHeader>
              <CardTitle>基本設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="プロジェクト名"
                value={project.name}
                onChange={(e) => setProject(prev => prev ? { ...prev, name: e.target.value } : null)}
                placeholder="プロジェクト名を入力"
                error={errors.name}
                disabled={!canManageProject}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  説明（任意）
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => setProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder="プロジェクトの説明を入力"
                  disabled={!canManageProject}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {project.description.length}/500文字
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="公開設定"
                  value={project.visibility}
                  onChange={(value) => setProject(prev => prev ? { ...prev, visibility: value as 'private' | 'public' } : null)}
                  options={[
                    { value: 'private', label: 'プライベート（招待されたメンバーのみ）' },
                    { value: 'public', label: 'パブリック（誰でも参加可能）' }
                  ]}
                  disabled={!canManageProject}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    プロジェクトカラー
                  </label>
                  <div className="flex space-x-2">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setProject(prev => prev ? { ...prev, color: option.value } : null)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          project.color === option.value 
                            ? 'border-gray-900 dark:border-gray-100' 
                            : 'border-gray-300 dark:border-gray-600'
                        } ${!canManageProject ? 'cursor-not-allowed opacity-50' : ''}`}
                        style={{ backgroundColor: option.color }}
                        title={option.label}
                        disabled={!canManageProject}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {canManageProject && (
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !project.name.trim()}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        保存中...
                      </>
                    ) : (
                      '変更を保存'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* メンバー管理 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>メンバー管理</CardTitle>
                {canManageProject && (
                  <Button onClick={() => setShowInviteModal(true)}>
                    メンバーを招待
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg">{member.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {member.userName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.userEmail}
                        </p>
                        <p className="text-xs text-gray-500">
                          参加日: {new Date(member.joinedAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {canManageProject && member.role !== 'owner' ? (
                        <Select
                          value={member.role}
                          onChange={(value) => handleRoleChange(member.id, value as ProjectMember['role'])}
                          options={[
                            { value: 'admin', label: roleLabels.admin },
                            { value: 'member', label: roleLabels.member },
                            { value: 'viewer', label: roleLabels.viewer }
                          ]}
                        />
                      ) : (
                        <Badge variant={member.role === 'owner' ? 'default' : 'outline'}>
                          {roleLabels[member.role]}
                        </Badge>
                      )}
                      {canManageProject && member.role !== 'owner' && member.userId !== user?.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          削除
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 危険な操作 */}
          {isOwner && (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-800 dark:text-red-200">危険な操作</CardTitle>
                <p className="text-sm text-red-600 dark:text-red-400">
                  以下の操作は取り消すことができません。慎重に実行してください。
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                >
                  プロジェクトを削除
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* エラー表示 */}
        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
          </div>
        )}

        {/* メンバー招待モーダル */}
        <Modal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          title="メンバーを招待"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="メールアドレス"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="招待するメンバーのメールアドレス"
              required
            />

            <Select
              label="権限"
              value={inviteRole}
              onChange={(value) => setInviteRole(value as ProjectMember['role'])}
              options={[
                { value: 'admin', label: `${roleLabels.admin} - ${roleDescriptions.admin}` },
                { value: 'member', label: `${roleLabels.member} - ${roleDescriptions.member}` },
                { value: 'viewer', label: `${roleLabels.viewer} - ${roleDescriptions.viewer}` }
              ]}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleInviteMember}
                disabled={!inviteEmail.trim()}
              >
                招待を送信
              </Button>
            </div>
          </div>
        </Modal>

        {/* 削除確認モーダル */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="プロジェクトの削除"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200 font-medium mb-2">
                ⚠️ この操作は取り消すことができません
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                プロジェクト「{project.name}」とすべてのタスク、コメント、添付ファイルが完全に削除されます。
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                確認のため、プロジェクト名を入力してください
              </label>
              <Input
                placeholder={project.name}
                onChange={() => {}} // 実際の実装では確認用の入力値をチェック
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                削除する
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}