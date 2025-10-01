'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import UserSelect from '@/components/ui/UserSelect';
import { Loading } from '@/components/ui/Loading';
import {
  Stage,
  Target,
  MatrixTask,
  TaskStatus,
  ActionItem,
  MatrixData,
  ProjectMember,
  MatrixViewState,
  TaskBadge,
  CSVImportMapping
} from '@/types/matrix';

export default function ProjectMatrixPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // 状態管理
  const [matrixData, setMatrixData] = useState<MatrixData>({
    stages: [
      { 
        id: '1', 
        projectId: params.id as string,
        name: '初期調査', 
        order: 0, 
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        projectId: params.id as string,
        name: '提案準備', 
        order: 1, 
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '3', 
        projectId: params.id as string,
        name: '提案実施', 
        order: 2, 
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '4', 
        projectId: params.id as string,
        name: 'フォローアップ', 
        order: 3, 
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '5', 
        projectId: params.id as string,
        name: '完了', 
        order: 4, 
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ],
    targets: [
      { 
        id: '1', 
        projectId: params.id as string,
        name: '田中商事', 
        displayName: '田中商事',
        email: 'tanaka@example.com', 
        order: 0, 
        archived: false,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        projectId: params.id as string,
        name: '佐藤工業', 
        displayName: '佐藤工業',
        email: 'sato@example.com', 
        order: 1, 
        archived: false,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: '3', 
        projectId: params.id as string,
        name: '鈴木製作所', 
        displayName: '鈴木製作所',
        email: 'suzuki@example.com', 
        order: 2, 
        archived: false,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ],
    tasks: [],
    actionCatalog: [
      {
        key: 'initial-meeting',
        name: '初回面談',
        description: '顧客との初回面談を実施する',
        category: '面談',
        isDefault: true,
        createdAt: new Date().toISOString()
      },
      {
        key: 'document-preparation',
        name: '書類準備',
        description: '必要書類の準備と確認を行う',
        category: '書類',
        isDefault: true,
        createdAt: new Date().toISOString()
      }
    ],
    projectMembers: [
      { 
        id: '1', 
        userId: 'user-1',
        projectId: params.id as string,
        name: '山田太郎', 
        email: 'yamada@example.com', 
        role: 'admin',
        joinedAt: new Date().toISOString()
      },
      { 
        id: '2', 
        userId: 'user-2',
        projectId: params.id as string,
        name: '田中花子', 
        email: 'tanaka@example.com', 
        role: 'editor',
        joinedAt: new Date().toISOString()
      },
    ],
  });

  const [viewState, setViewState] = useState<MatrixViewState>({
    showCompletedTasks: false,
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const [loading, setLoading] = useState(false);
  const [showAddStage, setShowAddStage] = useState(false);
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [editingTask, setEditingTask] = useState<MatrixTask | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  // フォーム状態
  const [stageForm, setStageForm] = useState({ name: '' });
  const [targetForm, setTargetForm] = useState({ name: '', email: '' });
  const [taskForm, setTaskForm] = useState({
    status: 'not_started' as TaskStatus,
    dueDate: '',
    assignees: [] as string[],
    actionItems: [] as ActionItem[],
    comments: '',
    attachments: [] as string[],
  });

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ユーティリティ関数
  const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'on_hold': return 'warning';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'not_started': return '未着手';
      case 'in_progress': return '進行中';
      case 'on_hold': return '保留';
      case 'completed': return '完了';
      case 'error': return 'エラー';
      default: return '未着手';
    }
  };

  // 工程管理関数
  const handleAddStage = () => {
    if (!stageForm.name.trim()) return;

    const newStage: Stage = {
      id: Date.now().toString(),
      projectId: params.id as string,
      name: stageForm.name,
      order: matrixData.stages.length,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMatrixData(prev => ({
      ...prev,
      stages: [...prev.stages, newStage],
    }));

    setStageForm({ name: '' });
    setShowAddStage(false);
  };

  const handleEditStage = (stage: Stage) => {
    setEditingStage(stage);
    setStageForm({ name: stage.name });
    setShowAddStage(true);
  };

  const handleUpdateStage = () => {
    if (!editingStage || !stageForm.name.trim()) return;

    setMatrixData(prev => ({
      ...prev,
      stages: prev.stages.map(stage =>
        stage.id === editingStage.id
          ? { ...stage, name: stageForm.name, updatedAt: new Date().toISOString() }
          : stage
      ),
    }));

    setEditingStage(null);
    setStageForm({ name: '' });
    setShowAddStage(false);
  };

  const handleDeleteStage = (stageId: string) => {
    if (confirm('この工程を削除しますか？関連するタスクも削除されます。')) {
      setMatrixData(prev => ({
        ...prev,
        stages: prev.stages.filter(stage => stage.id !== stageId),
        tasks: prev.tasks.filter(task => task.stageId !== stageId),
      }));
    }
  };

  // 顧客管理関数
  const handleAddTarget = async () => {
    if (!targetForm.name.trim()) return;

    const newTarget: Target = {
      id: Date.now().toString(),
      projectId: params.id as string,
      name: targetForm.name,
      displayName: targetForm.name,
      email: targetForm.email || '',
      order: matrixData.targets.length,
      archived: false,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // APIを呼び出して顧客を追加
      const response = await fetch(`/api/projects/${params.id}/targets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTarget),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMatrixData(prev => ({
            ...prev,
            targets: [...prev.targets, result.data],
          }));
        }
      }
    } catch (error) {
      console.error('顧客追加エラー:', error);
    }

    setTargetForm({ name: '', email: '' });
    setShowAddTarget(false);
  };

  const handleEditTarget = (target: Target) => {
    setEditingTarget(target);
    setTargetForm({ name: target.name, email: target.email || '' });
    setShowAddTarget(true);
  };

  const handleUpdateTarget = async () => {
    if (!editingTarget || !targetForm.name.trim()) return;

    const updatedTarget: Target = {
      ...editingTarget,
      name: targetForm.name,
      displayName: targetForm.name,
      email: targetForm.email || '',
      updatedAt: new Date().toISOString(),
    };

    try {
      // APIを呼び出して顧客を更新
      const response = await fetch(`/api/projects/${params.id}/targets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTarget),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMatrixData(prev => ({
            ...prev,
            targets: prev.targets.map(target => 
              target.id === editingTarget.id ? result.data : target
            ),
          }));
        }
      }
    } catch (error) {
      console.error('顧客更新エラー:', error);
    }

    setEditingTarget(null);
    setTargetForm({ name: '', email: '' });
    setShowAddTarget(false);
  };

  const handleDeleteTarget = async (targetId: string) => {
    if (confirm('この顧客を削除しますか？関連するタスクも削除されます。')) {
      try {
        const response = await fetch(`/api/projects/${params.id}/targets?targetId=${targetId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setMatrixData(prev => ({
              ...prev,
              targets: prev.targets.filter(target => target.id !== targetId),
              tasks: prev.tasks.filter(task => task.targetId !== targetId),
            }));
          }
        }
      } catch (error) {
        console.error('顧客削除エラー:', error);
        // エラーの場合はローカル状態のみ更新
        setMatrixData(prev => ({
          ...prev,
          targets: prev.targets.filter(target => target.id !== targetId),
          tasks: prev.tasks.filter(task => task.targetId !== targetId),
        }));
      }
    }
  };

  const handleArchiveTarget = async (targetId: string) => {
    try {
      const targetToUpdate = matrixData.targets.find(t => t.id === targetId);
      if (!targetToUpdate) return;

      const response = await fetch(`/api/projects/${params.id}/targets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...targetToUpdate,
          archived: !targetToUpdate.archived,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMatrixData(prev => ({
            ...prev,
            targets: prev.targets.map(target =>
              target.id === targetId
                ? { ...target, archived: !target.archived, updatedAt: new Date().toISOString() }
                : target
            ),
          }));
        }
      }
    } catch (error) {
      console.error('顧客アーカイブエラー:', error);
      // エラーの場合はローカル状態のみ更新
      setMatrixData(prev => ({
        ...prev,
        targets: prev.targets.map(target =>
          target.id === targetId
            ? { ...target, archived: !target.archived, updatedAt: new Date().toISOString() }
            : target
        ),
      }));
    }
  };

  // タスク管理関数
  const handleTaskEdit = (stageId: string, targetId: string) => {
    const existingTask = matrixData.tasks.find(task => 
      task.stageId === stageId && task.targetId === targetId
    );
    
    setSelectedStageId(stageId);
    setSelectedTargetId(targetId);
    
    if (existingTask) {
      setEditingTask(existingTask);
      setTaskForm({
        status: existingTask.status,
        dueDate: existingTask.dueDate || '',
        assignees: existingTask.assignees,
        actionItems: [],
        comments: existingTask.note || '',
        attachments: existingTask.attachments.map(a => a.fileName),
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        status: 'not_started',
        dueDate: '',
        assignees: [],
        actionItems: [],
        comments: '',
        attachments: [],
      });
    }
    
    setShowTaskEdit(true);
  };

  const handleTaskSave = async () => {
    const now = new Date().toISOString();
    
    const taskData: MatrixTask = {
      id: editingTask?.id || Date.now().toString(),
      projectId: params.id as string,
      stageId: selectedStageId,
      targetId: selectedTargetId,
      status: taskForm.status,
      dueDate: taskForm.dueDate || undefined,
      assignees: taskForm.assignees,
      actionKey: undefined,
      note: taskForm.comments || undefined,
      attachments: taskForm.attachments.map(fileName => ({
        id: Date.now().toString() + Math.random(),
        fileName,
        fileSize: 0,
        mimeType: 'application/octet-stream',
        s3Key: '',
        uploadedBy: user?.id || '',
        uploadedAt: now,
      })),
      createdBy: user?.id || '',
      createdAt: editingTask?.createdAt || now,
      updatedAt: now,
    };

    try {
      // APIを呼び出してタスクを保存
      const response = await fetch(`/api/projects/${params.id}/tasks`, {
        method: editingTask ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          matrix: { importance: 'high', urgency: 'high' } // database.ts のTask型に合わせる
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMatrixData(prev => ({
            ...prev,
            tasks: editingTask 
              ? prev.tasks.map(task => task.id === editingTask.id ? { ...taskData, ...result.data } : task)
              : [...prev.tasks, { ...taskData, ...result.data }],
          }));
        }
      }
    } catch (error) {
      console.error('タスク保存エラー:', error);
    }

    setShowTaskEdit(false);
    setEditingTask(null);
  };

  const handleTaskDelete = () => {
    if (editingTask && confirm('このタスクを削除しますか？')) {
      setMatrixData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== editingTask.id),
      }));
      
      setShowTaskEdit(false);
      setEditingTask(null);
    }
  };

  // ドラッグ&ドロップ処理
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'stage') {
      const newStages = Array.from(matrixData.stages);
      const [reorderedStage] = newStages.splice(source.index, 1);
      newStages.splice(destination.index, 0, reorderedStage);

      const updatedStages = newStages.map((stage, index) => ({
        ...stage,
        order: index,
      }));

      setMatrixData(prev => ({ ...prev, stages: updatedStages }));
    } else if (type === 'target') {
      const newTargets = Array.from(matrixData.targets);
      const [reorderedTarget] = newTargets.splice(source.index, 1);
      newTargets.splice(destination.index, 0, reorderedTarget);

      const updatedTargets = newTargets.map((target, index) => ({
        ...target,
        order: index,
      }));

      setMatrixData(prev => ({ ...prev, targets: updatedTargets }));
    }
  };

  // CSVインポート処理
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const newTargets: Target[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 2) {
          newTargets.push({
            id: Date.now().toString() + i,
            projectId: params.id as string,
            name: values[0].trim(),
            displayName: values[0].trim(),
            email: values[1].trim(),
            order: matrixData.targets.length + i - 1,
            archived: false,
            metadata: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
      
      setMatrixData(prev => ({
        ...prev,
        targets: [...prev.targets, ...newTargets],
      }));
    };
    
    reader.readAsText(file);
    setShowCSVImport(false);
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const filteredTargets = matrixData.targets.filter(target => !target.archived);

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/projects')} 
                variant="outline"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>プロジェクト一覧</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">プロジェクトマトリクス</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">工程と顧客の進捗管理</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={() => setShowAddStage(true)}>
                工程追加
              </Button>
              <Button onClick={() => setShowAddTarget(true)}>
            顧客追加
          </Button>
              <Button onClick={() => setShowCSVImport(true)} variant="outline">
                CSV インポート
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center space-x-4">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={viewState.showCompletedTasks}
              onChange={(e) => setViewState(prev => ({ ...prev, showCompletedTasks: e.target.checked }))}
              className="mr-2 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
            />
            完了済みタスクを表示
          </label>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 min-w-[200px] w-[200px]">
                      工程 / 顧客
                    </th>
                    {filteredTargets.map((target, index) => (
                      <th
                        key={target.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-600 min-w-[200px] w-[200px]"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{target.name}</div>
                            <div className="text-gray-400 dark:text-gray-500">{target.email}</div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditTarget(target)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleArchiveTarget(target.id)}
                              className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 text-xs"
                            >
                              {target.archived ? '復元' : 'アーカイブ'}
                            </button>
                            <button
                              onClick={() => handleDeleteTarget(target.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {matrixData.stages.map((stage, index) => (
                    <tr
                      key={stage.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 min-w-[200px] w-[200px]"
                      >
                        <div className="flex items-center justify-between">
                          <span>{stage.name}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditStage(stage)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleDeleteStage(stage.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </td>
                      {filteredTargets.map((target) => {
                        const taskKey = `${stage.id}-${target.id}`;
                        const task = matrixData.tasks.find(t => t.stageId === stage.id && t.targetId === target.id);
                        
                        return (
                          <td
                            key={taskKey}
                            className="px-6 py-4 border-r border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 min-w-[200px] w-[200px]"
                            onClick={() => handleTaskEdit(stage.id, target.id)}
                          >
                            {task ? (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge variant={getStatusBadgeVariant(task.status)}>
                                    {getStatusLabel(task.status)}
                                  </Badge>
                                  {task.dueDate && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                                    </span>
                                  )}
                                </div>
                                {task.assignees.length > 0 && (
                                  <div className="text-xs text-gray-600 dark:text-gray-300">
                                    担当: {task.assignees.map((id: string) => 
                                      matrixData.projectMembers.find((m: ProjectMember) => m.id === id)?.name
                                    ).join(', ')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-400 dark:text-gray-500 text-sm">
                                クリックして編集
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* 工程追加/編集モーダル */}
      <Modal
        isOpen={showAddStage}
        onClose={() => {
          setShowAddStage(false);
          setEditingStage(null);
          setStageForm({ name: '' });
        }}
        title={editingStage ? '工程編集' : '工程追加'}
      >
        <div className="space-y-4">
          <Input
            label="工程名"
            value={stageForm.name}
            onChange={(e) => setStageForm({ name: e.target.value })}
            placeholder="工程名を入力"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddStage(false);
                setEditingStage(null);
                setStageForm({ name: '' });
              }}
            >
              キャンセル
            </Button>
            <Button onClick={editingStage ? handleUpdateStage : handleAddStage}>
              {editingStage ? '更新' : '追加'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 顧客追加/編集モーダル */}
      <Modal
        isOpen={showAddTarget}
        onClose={() => {
          setShowAddTarget(false);
          setEditingTarget(null);
          setTargetForm({ name: '', email: '' });
        }}
        title={editingTarget ? '顧客編集' : '顧客追加'}
      >
        <div className="space-y-4">
          <Input
            label="顧客名"
            value={targetForm.name}
            onChange={(e) => setTargetForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="顧客名を入力"
          />
          <Input
            label="メールアドレス"
            type="email"
            value={targetForm.email}
            onChange={(e) => setTargetForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="メールアドレスを入力"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddTarget(false);
                setEditingTarget(null);
                setTargetForm({ name: '', email: '' });
              }}
            >
              キャンセル
            </Button>
            <Button onClick={editingTarget ? handleUpdateTarget : handleAddTarget}>
              {editingTarget ? '更新' : '追加'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* CSVインポートモーダル */}
      <Modal
        isOpen={showCSVImport}
        onClose={() => setShowCSVImport(false)}
        title="CSV インポート"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            CSV ファイルをアップロードして顧客を一括追加できます。<br />
            形式: 顧客名,メールアドレス
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowCSVImport(false)}>
              キャンセル
            </Button>
          </div>
        </div>
      </Modal>

      {/* タスク編集モーダル */}
      <Modal
        isOpen={showTaskEdit}
        onClose={() => setShowTaskEdit(false)}
        title="タスク編集"
      >
        <div className="space-y-4">
          <Select
            label="ステータス"
            value={taskForm.status}
            onChange={(value) => setTaskForm(prev => ({ ...prev, status: value as TaskStatus }))}
            options={[
              { value: 'not_started', label: '未着手' },
              { value: 'in_progress', label: '進行中' },
              { value: 'on_hold', label: '保留' },
              { value: 'completed', label: '完了' },
              { value: 'error', label: 'エラー' },
            ]}
          />
          <Input
            label="期日"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
          />
          <UserSelect
            label="担当者"
            value={taskForm.assignees[0] || ''}
            onChange={(value) => setTaskForm(prev => ({ ...prev, assignees: value ? [value] : [] }))}
            placeholder="担当者を選択"
            projectId={params?.id ? (typeof params.id === 'string' ? params.id : params.id[0]) : undefined}
          />
          <Textarea
            label="コメント"
            value={taskForm.comments}
            onChange={(e) => setTaskForm(prev => ({ ...prev, comments: e.target.value }))}
            placeholder="コメントを入力"
            rows={3}
          />
          <div className="flex justify-between">
            <div>
              {editingTask && (
                <Button variant="outline" onClick={handleTaskDelete} className="text-red-600">
                  削除
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowTaskEdit(false)}>
                キャンセル
              </Button>
              <Button onClick={handleTaskSave}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}