'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal, Input, Select } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/types/database';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface MatrixQuadrant {
  key: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  importance: 'high' | 'low';
  urgency: 'high' | 'low';
}

export default function MatrixPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<MatrixQuadrant | null>(null);
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

  // マトリクスの4象限定義
  const quadrants: MatrixQuadrant[] = [
    {
      key: 'high-high',
      title: '重要・緊急',
      description: '今すぐやる',
      color: 'text-red-800',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      importance: 'high',
      urgency: 'high'
    },
    {
      key: 'high-low',
      title: '重要・非緊急',
      description: '計画してやる',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      importance: 'high',
      urgency: 'low'
    },
    {
      key: 'low-high',
      title: '非重要・緊急',
      description: '人に任せる',
      color: 'text-blue-800',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      importance: 'low',
      urgency: 'high'
    },
    {
      key: 'low-low',
      title: '非重要・非緊急',
      description: 'やらない',
      color: 'text-gray-800',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      importance: 'low',
      urgency: 'low'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // モックデータを読み込み
    const mockProject: Project = {
      id: projectId,
      name: 'ウェブサイトリニューアル',
      description: 'コーポレートサイトの全面リニューアルプロジェクト'
    };

    const mockTasks: Task[] = [
      {
        id: '1',
        projectId: projectId,
        title: 'サーバーダウン対応',
        description: '本番サーバーが停止している問題の緊急対応',
        status: 'in_progress',
        priority: 'urgent',
        createdBy: 'user1',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        dueDate: '2024-01-21',
        tags: ['緊急', 'インフラ'],
        matrix: { importance: 'high', urgency: 'high' }
      },
      {
        id: '2',
        projectId: projectId,
        title: 'デザインシステムの構築',
        description: '長期的な開発効率向上のためのデザインシステム設計',
        status: 'todo',
        priority: 'high',
        createdBy: 'user1',
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
        dueDate: '2024-02-15',
        tags: ['デザイン', '戦略'],
        matrix: { importance: 'high', urgency: 'low' }
      },
      {
        id: '3',
        projectId: projectId,
        title: '会議資料の作成',
        description: '明日の定例会議用の資料作成',
        status: 'todo',
        priority: 'medium',
        createdBy: 'user1',
        createdAt: '2024-01-17T14:00:00Z',
        updatedAt: '2024-01-17T14:00:00Z',
        dueDate: '2024-01-22',
        tags: ['資料', '会議'],
        matrix: { importance: 'low', urgency: 'high' }
      },
      {
        id: '4',
        projectId: projectId,
        title: 'SNSアカウントの整理',
        description: '使っていないSNSアカウントの整理',
        status: 'todo',
        priority: 'low',
        createdBy: 'user1',
        createdAt: '2024-01-18T11:00:00Z',
        updatedAt: '2024-01-18T11:00:00Z',
        tags: ['整理', 'SNS'],
        matrix: { importance: 'low', urgency: 'low' }
      },
      {
        id: '5',
        projectId: projectId,
        title: 'セキュリティ監査',
        description: 'システム全体のセキュリティ監査と改善',
        status: 'todo',
        priority: 'high',
        createdBy: 'user1',
        createdAt: '2024-01-19T13:00:00Z',
        updatedAt: '2024-01-19T13:00:00Z',
        dueDate: '2024-03-01',
        tags: ['セキュリティ', '監査'],
        matrix: { importance: 'high', urgency: 'low' }
      }
    ];

    setTimeout(() => {
      setProject(mockProject);
      setTasks(mockTasks);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, router, projectId]);

  const getTasksByQuadrant = (quadrant: MatrixQuadrant) => {
    return tasks.filter(task => 
      task.matrix.importance === quadrant.importance && 
      task.matrix.urgency === quadrant.urgency
    );
  };

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

  const handleQuadrantClick = (quadrant: MatrixQuadrant) => {
    setSelectedQuadrant(quadrant);
    setNewTask(prev => ({
      ...prev,
      matrix: {
        importance: quadrant.importance,
        urgency: quadrant.urgency
      }
    }));
    setShowCreateTaskModal(true);
  };

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline" size="sm">未着手</Badge>;
      case 'in_progress':
        return <Badge variant="info" size="sm">進行中</Badge>;
      case 'done':
        return <Badge variant="success" size="sm">完了</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">マトリクスを読み込み中...</p>
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
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-500 mr-2">
              ← プロジェクト詳細
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {project.name} - マトリクス表示
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                重要度と緊急度でタスクを整理・管理しましょう
              </p>
            </div>
            <Button onClick={() => setShowCreateTaskModal(true)}>
              新しいタスク
            </Button>
          </div>
        </div>

        {/* マトリクス説明 */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            アイゼンハワー・マトリクス
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            タスクを重要度と緊急度の2軸で分類し、優先順位を明確にします。各象限をクリックしてタスクを追加できます。
          </p>
        </div>

        {/* マトリクス表示 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {quadrants.map((quadrant) => {
            const quadrantTasks = getTasksByQuadrant(quadrant);
            return (
              <Card 
                key={quadrant.key} 
                className={`${quadrant.bgColor} ${quadrant.borderColor} border-2 hover:shadow-lg transition-all cursor-pointer min-h-[400px]`}
                onClick={() => handleQuadrantClick(quadrant)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className={`text-lg ${quadrant.color}`}>
                        {quadrant.title}
                      </CardTitle>
                      <p className={`text-sm ${quadrant.color} opacity-75 mt-1`}>
                        {quadrant.description}
                      </p>
                    </div>
                    <Badge variant="outline" className={`${quadrant.color} border-current`}>
                      {quadrantTasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {quadrantTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <div className={`w-12 h-12 mx-auto mb-3 ${quadrant.bgColor} rounded-full flex items-center justify-center border ${quadrant.borderColor}`}>
                          <svg className={`w-6 h-6 ${quadrant.color} opacity-50`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className={`text-sm ${quadrant.color} opacity-75`}>
                          タスクがありません
                        </p>
                        <p className={`text-xs ${quadrant.color} opacity-50 mt-1`}>
                          クリックして追加
                        </p>
                      </div>
                    ) : (
                      quadrantTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className="bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                              {task.title}
                            </h4>
                            {getStatusBadge(task.status)}
                          </div>
                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            {task.dueDate && (
                              <span className="text-xs text-gray-500">
                                期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                              </span>
                            )}
                            <div className="flex space-x-1">
                              {task.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 軸ラベル */}
        <div className="relative">
          {/* 縦軸（重要度） */}
          <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">重要度</span>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <span className="text-xs text-gray-500">低</span>
                <div className="w-8 h-1 bg-gradient-to-r from-gray-300 to-red-500 rounded"></div>
                <span className="text-xs text-gray-500">高</span>
              </div>
            </div>
          </div>

          {/* 横軸（緊急度） */}
          <div className="text-center mt-8">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">緊急度</span>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <span className="text-xs text-gray-500">低</span>
              <div className="w-16 h-1 bg-gradient-to-r from-gray-300 to-red-500 rounded"></div>
              <span className="text-xs text-gray-500">高</span>
            </div>
          </div>
        </div>

        {/* タスク作成モーダル */}
        <Modal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          title={selectedQuadrant ? `新しいタスク - ${selectedQuadrant.title}` : '新しいタスク'}
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

            {selectedQuadrant && (
              <div className={`p-3 rounded-md ${selectedQuadrant.bgColor} ${selectedQuadrant.borderColor} border`}>
                <p className={`text-sm ${selectedQuadrant.color}`}>
                  <strong>{selectedQuadrant.title}</strong>の象限に追加されます
                </p>
                <p className={`text-xs ${selectedQuadrant.color} opacity-75 mt-1`}>
                  {selectedQuadrant.description}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateTaskModal(false);
                  setSelectedQuadrant(null);
                }}
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
      </div>
    </Layout>
  );
}