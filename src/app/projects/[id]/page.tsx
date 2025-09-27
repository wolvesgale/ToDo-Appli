'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal, Input, Select } from '@/components/ui';
import { ExportDialog } from '@/components/ExportDialog';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/types/database';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    matrix: {
      importance: 'high' as 'high' | 'low',
      urgency: 'high' as 'high' | 'low'
    }
  });

  const projectId = params.id as string;

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
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      memberCount: 5
    };

    const mockTasks: Task[] = [
      {
        id: '1',
        projectId: projectId,
        title: 'デザインカンプの作成',
        description: 'トップページのデザインカンプを作成する',
        status: 'in_progress',
        priority: 'high',
        createdBy: 'user1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        dueDate: '2024-01-25',
        tags: ['デザイン', 'UI/UX'],
        matrix: {
          importance: 'high',
          urgency: 'high'
        }
      },
      {
        id: '2',
        projectId: projectId,
        title: 'コンテンツの整理',
        description: '既存コンテンツの整理と新規コンテンツの企画',
        status: 'todo',
        priority: 'medium',
        createdBy: 'user1',
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
        dueDate: '2024-01-30',
        tags: ['コンテンツ', '企画'],
        matrix: {
          importance: 'high',
          urgency: 'low'
        }
      },
      {
        id: '3',
        projectId: projectId,
        title: 'SEO対策の実装',
        description: 'メタタグやサイトマップの最適化',
        status: 'todo',
        priority: 'low',
        createdBy: 'user1',
        createdAt: '2024-01-17T14:00:00Z',
        updatedAt: '2024-01-17T14:00:00Z',
        tags: ['SEO', '技術'],
        matrix: {
          importance: 'low',
          urgency: 'low'
        }
      }
    ];

    setTimeout(() => {
      setProject(mockProject);
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, authLoading, user, router, projectId]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      projectId: projectId,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      createdBy: user?.id || 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      matrix: newTask.matrix
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      matrix: { importance: 'high', urgency: 'high' }
    });
    setShowCreateTaskModal(false);
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline">未着手</Badge>;
      case 'in_progress':
        return <Badge variant="info">進行中</Badge>;
      case 'done':
        return <Badge variant="success">完了</Badge>;
      case 'archived':
        return <Badge variant="default">アーカイブ</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="danger">緊急</Badge>;
      case 'high':
        return <Badge variant="warning">高</Badge>;
      case 'medium':
        return <Badge variant="info">中</Badge>;
      case 'low':
        return <Badge variant="outline">低</Badge>;
      default:
        return <Badge variant="default">{priority}</Badge>;
    }
  };

  const getMatrixQuadrant = (importance: string, urgency: string) => {
    const key = `${importance}-${urgency}`;
    const quadrants = {
      'high-high': { label: '重要・緊急', color: 'bg-red-100 border-red-300 text-red-800' },
      'high-low': { label: '重要・非緊急', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
      'low-high': { label: '非重要・緊急', color: 'bg-blue-100 border-blue-300 text-blue-800' },
      'low-low': { label: '非重要・非緊急', color: 'bg-gray-100 border-gray-300 text-gray-800' }
    };
    return quadrants[key as keyof typeof quadrants] || quadrants['low-low'];
  };

  if (loading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プロジェクトヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/projects" className="text-blue-600 hover:text-blue-500 mr-2">
              ← プロジェクト一覧
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="success">進行中</Badge>
                <span className="text-sm text-gray-500">{project.memberCount}人のメンバー</span>
                <span className="text-sm text-gray-500">更新日: {project.updatedAt}</span>
              </div>
            </div>
            <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowExportDialog(true)}
                >
                  エクスポート
                </Button>
                <Link href={`/projects/${projectId}/matrix`}>
                  <Button variant="outline">
                    マトリクス表示
                  </Button>
                </Link>
                <Link href={`/projects/${projectId}/settings`}>
                  <Button variant="outline">
                    設定
                  </Button>
                </Link>
                <Button onClick={() => setShowCreateTaskModal(true)}>
                  新しいタスク
                </Button>
              </div>
          </div>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            タスク一覧 ({tasks.length})
          </h2>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                タスクがありません
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                最初のタスクを作成して始めましょう
              </p>
              <Button onClick={() => setShowCreateTaskModal(true)}>
                タスクを作成
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => {
                const quadrant = getMatrixQuadrant(task.matrix.importance, task.matrix.urgency);
                return (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {task.title}
                        </h3>
                        <div className="flex space-x-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`px-2 py-1 rounded-md border text-xs font-medium ${quadrant.color}`}>
                            {quadrant.label}
                          </div>
                          {task.dueDate && (
                            <span className="text-sm text-gray-500">
                              期限: {task.dueDate}
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* タスク作成モーダル */}
        <Modal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          title="新しいタスク"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              label="タスク名"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="タスク名を入力"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                説明（任意）
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                placeholder="タスクの詳細を入力"
              />
            </div>

            <Select
              label="優先度"
              value={newTask.priority}
              onChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task['priority'] }))}
              options={[
                { value: 'low', label: '低' },
                { value: 'medium', label: '中' },
                { value: 'high', label: '高' },
                { value: 'urgent', label: '緊急' }
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="重要度"
                value={newTask.matrix.importance}
                onChange={(value) => setNewTask(prev => ({ 
                  ...prev, 
                  matrix: { ...prev.matrix, importance: value as 'high' | 'low' }
                }))}
                options={[
                  { value: 'high', label: '重要' },
                  { value: 'low', label: '非重要' }
                ]}
              />

              <Select
                label="緊急度"
                value={newTask.matrix.urgency}
                onChange={(value) => setNewTask(prev => ({ 
                  ...prev, 
                  matrix: { ...prev.matrix, urgency: value as 'high' | 'low' }
                }))}
                options={[
                  { value: 'high', label: '緊急' },
                  { value: 'low', label: '非緊急' }
                ]}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateTaskModal(false)}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim()}
              >
                作成
              </Button>
            </div>
          </div>
        </Modal>

        {/* エクスポートダイアログ */}
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          tasks={tasks}
          projectName={project?.name || 'プロジェクト'}
        />
      </div>
    </Layout>
  );
}