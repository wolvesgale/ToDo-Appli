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
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchProjects();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(prev => [data.data, ...prev]);
        setNewProject({ name: '', description: '' });
        setShowCreateModal(false);
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`/api/projects?id=${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openDeleteModal = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'アクティブ', variant: 'success' as const },
      completed: { label: '完了', variant: 'default' as const },
      archived: { label: 'アーカイブ', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {project.memberCount}人 • {project.taskCount}タスク
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => openDeleteModal(project, e)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        削除
                      </Button>
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

        {/* 削除確認モーダル */}
        {showDeleteModal && projectToDelete && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="プロジェクトを削除"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                「{projectToDelete.name}」を削除してもよろしいですか？
                この操作は取り消すことができません。
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  キャンセル
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteProject}
                >
                  削除
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}