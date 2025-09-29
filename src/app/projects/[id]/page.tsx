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
    priority: 'high' as Task['priority'],
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
      router.push('/auth/login');
      return;
    }

    // モックデータを読み込み
    let mockProject: Project;
    let mockTasks: Task[];

    if (projectId === '1') {
      // サンプルプロジェクト1
      mockProject = {
        id: projectId,
        name: 'サンプルプロジェクト1',
        description: 'これはサンプルプロジェクトです',
        status: 'active',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        memberCount: 3
      };

      mockTasks = [
        {
          id: '1',
          projectId: projectId,
          title: 'サンプルタスク1',
          description: 'これはサンプルタスクです',
          status: 'in_progress',
          priority: 'high',
          createdBy: 'user1',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T15:30:00Z',
          dueDate: '2024-01-25',
          tags: ['サンプル', 'テスト'],
          matrix: {
            importance: 'high',
            urgency: 'high'
          }
        },
        {
          id: '2',
          projectId: projectId,
          title: 'サンプルタスク2',
          description: '2番目のサンプルタスクです',
          status: 'todo',
          priority: 'high',
          createdBy: 'user1',
          createdAt: '2024-01-16T09:00:00Z',
          updatedAt: '2024-01-16T09:00:00Z',
          dueDate: '2024-01-30',
          tags: ['サンプル', 'テスト'],
          matrix: {
            importance: 'high',
            urgency: 'low'
          }
        }
      ];
    } else if (projectId === '2') {
      // サンプルプロジェクト2
      mockProject = {
        id: projectId,
        name: 'サンプルプロジェクト2',
        description: 'これは2番目のサンプルプロジェクトです',
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        memberCount: 4
      };

      mockTasks = [
        {
          id: '1',
          projectId: projectId,
          title: 'プロジェクト2のタスク1',
          description: 'プロジェクト2の最初のタスクです',
          status: 'done',
          priority: 'high',
          createdBy: 'user1',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-15T15:30:00Z',
          dueDate: '2024-01-20',
          tags: ['完了', 'テスト'],
          matrix: {
            importance: 'high',
            urgency: 'high'
          }
        },
        {
          id: '2',
          projectId: projectId,
          title: 'プロジェクト2のタスク2',
          description: 'プロジェクト2の2番目のタスクです',
          status: 'in_progress',
          priority: 'high',
          createdBy: 'user1',
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-18T09:00:00Z',
          dueDate: '2024-01-25',
          tags: ['進行中', 'テスト'],
          matrix: {
            importance: 'high',
            urgency: 'high'
          }
        }
      ];
    } else {
      // 新しく作成されたプロジェクトまたはその他のプロジェクト
      mockProject = {
        id: projectId,
        name: '新しいプロジェクト',
        description: '新しく作成されたプロジェクトです',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        memberCount: 1
      };

      mockTasks = [
        {
          id: '1',
          projectId: projectId,
          title: 'プロジェクトの初期設定',
          description: 'プロジェクトの基本設定を行います',
          status: 'todo',
          priority: 'high',
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7日後
          tags: ['初期設定', '重要'],
          matrix: {
            importance: 'high',
            urgency: 'high'
          }
        }
      ];
    }

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

    try {
      // APIを呼び出してタスクを作成
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTasks(prev => [result.data, ...prev]);
        }
      }
    } catch (error) {
      console.error('タスク作成エラー:', error);
      // エラーの場合はローカル状態のみ更新
      setTasks(prev => [task, ...prev]);
    }

    setNewTask({
      title: '',
      description: '',
      priority: 'high',
      matrix: {
        importance: 'high',
        urgency: 'high'
      }
    });
    setShowCreateTaskModal(false);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTasks(prev => prev.filter(task => task.id !== taskId));
        }
      }
    } catch (error) {
      console.error('タスク削除エラー:', error);
      // エラーの場合はローカル状態のみ更新
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
          ));
        }
      }
    } catch (error) {
      console.error('タスクステータス更新エラー:', error);
      // エラーの場合はローカル状態のみ更新
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
      ));
    }
  };

  // getStatusBadge関数の修正
  const getStatusBadge = (status: Task['status']) => {
    const statusConfig = {
      todo: { label: '未着手', color: 'bg-gray-100 text-gray-800' },
      in_progress: { label: '進行中', color: 'bg-blue-100 text-blue-800' },
      done: { label: '完了', color: 'bg-green-100 text-green-800' },
      archived: { label: 'アーカイブ', color: 'bg-gray-100 text-gray-600' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };
  
  // getPriorityBadge関数の修正
  const getPriorityBadge = (priority: Task['priority']) => {
    const priorityConfig = {
      low: { label: '低', color: 'bg-gray-100 text-gray-800' },
      medium: { label: '中', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: '高', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: '緊急', color: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">プロジェクトを読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">プロジェクトが見つかりません</h2>
            <p className="text-gray-600 mb-6">指定されたプロジェクトは存在しないか、アクセス権限がありません。</p>
            <Link href="/projects">
              <Button>プロジェクト一覧に戻る</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const doneTasks = tasks.filter(task => task.status === 'done');
  const archivedTasks = tasks.filter(task => task.status === 'archived');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* プロジェクトヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowExportDialog(true)}
                variant="outline"
              >
                エクスポート
              </Button>
              <Link href={`/projects/${projectId}/settings`}>
                <Button variant="outline">設定</Button>
              </Link>
              <Link href={`/projects/${projectId}/matrix`}>
                <Button>マトリクス表示</Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>メンバー: {project.memberCount}人</span>
            <span>作成日: {new Date(project.createdAt).toLocaleDateString('ja-JP')}</span>
            <span>更新日: {new Date(project.updatedAt).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>

        {/* タスク作成ボタン */}
        <div className="mb-6">
          <Button onClick={() => setShowCreateTaskModal(true)}>
            新しいタスクを作成
          </Button>
        </div>

        {/* タスク統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{todoTasks.length}</div>
              <div className="text-sm text-gray-500">未着手</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
              <div className="text-sm text-gray-500">進行中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{doneTasks.length}</div>
              <div className="text-sm text-gray-500">完了</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{archivedTasks.length}</div>
              <div className="text-sm text-gray-500">アーカイブ</div>
            </CardContent>
          </Card>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">タスク一覧</h2>
          
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">まだタスクがありません。新しいタスクを作成してください。</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {task.dueDate && (
                            <span>期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}</span>
                          )}
                          <span>作成: {new Date(task.createdAt).toLocaleDateString('ja-JP')}</span>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex space-x-1">
                              {task.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select
                          value={task.status}
                          onChange={(value) => handleUpdateTaskStatus(task.id, value as Task['status'])}
                          options={[
                            { value: 'todo', label: '未着手' },
                            { value: 'in_progress', label: '進行中' },
                            { value: 'done', label: '完了' },
                            { value: 'archived', label: 'アーカイブ' }
                          ]}
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          削除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* タスク作成モーダル */}
        <Modal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          title="新しいタスクを作成"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タスク名 *
              </label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="タスク名を入力してください"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="タスクの詳細を入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <Select
                value={newTask.priority}
                onChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task['priority'] }))}
                options={[
                  { value: 'low', label: '低' },
                  { value: 'medium', label: '中' },
                  { value: 'high', label: '高' },
                  { value: 'urgent', label: '緊急' }
                ]}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  重要度
                </label>
                <Select
                  value={newTask.matrix.importance}
                  onChange={(value) => setNewTask(prev => ({ 
                    ...prev, 
                    matrix: { ...prev.matrix, importance: value as 'high' | 'low' }
                  }))}
                  options={[
                    { value: 'low', label: '低' },
                    { value: 'high', label: '高' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  緊急度
                </label>
                <Select
                  value={newTask.matrix.urgency}
                  onChange={(value) => setNewTask(prev => ({ 
                    ...prev, 
                    matrix: { ...prev.matrix, urgency: value as 'high' | 'low' }
                  }))}
                  options={[
                    { value: 'low', label: '低' },
                    { value: 'high', label: '高' }
                  ]}
                />
              </div>
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