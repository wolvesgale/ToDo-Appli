'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  taskCount: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

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
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'ウェブサイトリニューアル',
        description: 'コーポレートサイトの全面リニューアルプロジェクト',
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        memberCount: 5,
        taskCount: 23
      },
      {
        id: '2',
        name: 'モバイルアプリ開発',
        description: '新しいモバイルアプリケーションの開発',
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-19',
        memberCount: 3,
        taskCount: 15
      },
      {
        id: '3',
        name: 'マーケティングキャンペーン',
        description: '春の新商品プロモーション企画',
        status: 'completed',
        createdAt: '2023-12-01',
        updatedAt: '2024-01-05',
        memberCount: 4,
        taskCount: 12
      }
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setProjectsLoading(false);
    }, 1000);
  }, [isAuthenticated, authLoading, user, router]);

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      memberCount: 1,
      taskCount: 0
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({ name: '', description: '' });
    setShowCreateModal(false);
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">進行中</Badge>;
      case 'completed':
        return <Badge variant="default">完了</Badge>;
      case 'archived':
        return <Badge variant="outline">アーカイブ</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (authLoading || projectsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">プロジェクトを読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              プロジェクト
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              チームでタスクを管理し、効率的にプロジェクトを進めましょう
            </p>
          </div>
          <Link href="/projects/create">
            <Button>
              新しいプロジェクト
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              プロジェクトがありません
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              最初のプロジェクトを作成して始めましょう
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              プロジェクトを作成
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/projects/${project.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{project.memberCount}人のメンバー</span>
                      <span>{project.taskCount}個のタスク</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      更新日: {project.updatedAt}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="新しいプロジェクト"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                プロジェクト名
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="プロジェクト名を入力"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                説明（任意）
              </label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="プロジェクトの説明を入力"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProject.name.trim()}
              >
                作成
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}