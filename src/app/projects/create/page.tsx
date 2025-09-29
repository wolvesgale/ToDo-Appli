'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, Badge } from '@/components/ui';
import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/useAuth';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultTasks: string[];
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: '',
    visibility: 'private' as 'private' | 'public',
    color: '#3B82F6'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // プロジェクトテンプレート
  const templates: ProjectTemplate[] = [
    {
      id: 'blank',
      name: '空のプロジェクト',
      description: 'ゼロから始める空のプロジェクト',
      icon: '📄',
      color: '#6B7280',
      defaultTasks: []
    },
    {
      id: 'web-development',
      name: 'ウェブ開発',
      description: 'ウェブサイト・アプリケーション開発プロジェクト',
      icon: '💻',
      color: '#3B82F6',
      defaultTasks: [
        '要件定義',
        'デザイン作成',
        'フロントエンド開発',
        'バックエンド開発',
        'テスト',
        'デプロイ'
      ]
    },
    {
      id: 'marketing',
      name: 'マーケティング',
      description: 'マーケティングキャンペーン・プロモーション',
      icon: '📈',
      color: '#10B981',
      defaultTasks: [
        '市場調査',
        'ターゲット分析',
        'コンテンツ作成',
        'キャンペーン実行',
        '効果測定',
        '改善施策'
      ]
    },
    {
      id: 'product-launch',
      name: '製品ローンチ',
      description: '新製品・サービスのローンチプロジェクト',
      icon: '🚀',
      color: '#F59E0B',
      defaultTasks: [
        '製品企画',
        '開発・製造',
        'マーケティング戦略',
        'プレスリリース',
        'ローンチイベント',
        'フォローアップ'
      ]
    },
    {
      id: 'event-planning',
      name: 'イベント企画',
      description: 'イベント・セミナー・会議の企画運営',
      icon: '🎉',
      color: '#8B5CF6',
      defaultTasks: [
        '企画立案',
        '会場手配',
        '講師・ゲスト調整',
        '集客・宣伝',
        '当日運営',
        '事後フォロー'
      ]
    },
    {
      id: 'research',
      name: '調査・研究',
      description: '市場調査・技術研究プロジェクト',
      icon: '🔬',
      color: '#EF4444',
      defaultTasks: [
        '調査計画',
        'データ収集',
        'データ分析',
        '仮説検証',
        'レポート作成',
        '結果発表'
      ]
    }
  ];

  const colorOptions = [
    { value: '#3B82F6', label: 'ブルー', color: '#3B82F6' },
    { value: '#10B981', label: 'グリーン', color: '#10B981' },
    { value: '#F59E0B', label: 'オレンジ', color: '#F59E0B' },
    { value: '#8B5CF6', label: 'パープル', color: '#8B5CF6' },
    { value: '#EF4444', label: 'レッド', color: '#EF4444' },
    { value: '#6B7280', label: 'グレー', color: '#6B7280' }
  ];

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'プロジェクト名は必須です';
    } else if (formData.name.length > 100) {
      newErrors.name = 'プロジェクト名は100文字以内で入力してください';
    }

    if (formData.description.length > 500) {
      newErrors.description = '説明は500文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 実際の実装では、ここでAPIを呼び出してプロジェクトを作成
      const selectedTemplate = templates.find(t => t.id === formData.template);
      
      const projectData = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        visibility: formData.visibility,
        template: formData.template,
        defaultTasks: selectedTemplate?.defaultTasks || [],
        createdBy: user?.id || 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // モック処理：実際にはAPIを呼び出す
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 作成したプロジェクトの詳細ページにリダイレクト
      router.push(`/projects/${projectData.id}`);
    } catch (error) {
      console.error('プロジェクト作成エラー:', error);
      setErrors({ submit: 'プロジェクトの作成に失敗しました。もう一度お試しください。' });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setFormData(prev => ({
      ...prev,
      template: templateId,
      color: template?.color || prev.color
    }));
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">認証を確認中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // useEffectでリダイレクトされるため、何も表示しない
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/projects" className="text-blue-600 hover:text-blue-500 mr-2">
              ← プロジェクト一覧
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            新しいプロジェクト
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            プロジェクトを作成して、チームでタスクを管理しましょう
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="プロジェクト名"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="プロジェクト名を入力"
                error={errors.name}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  説明（任意）
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="プロジェクトの説明を入力"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/500文字
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="公開設定"
                  value={formData.visibility}
                  onChange={(value) => setFormData(prev => ({ ...prev, visibility: value as 'private' | 'public' }))}
                  options={[
                    { value: 'private', label: 'プライベート（招待されたメンバーのみ）' },
                    { value: 'public', label: 'パブリック（誰でも参加可能）' }
                  ]}
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
                        onClick={() => setFormData(prev => ({ ...prev, color: option.value }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === option.value 
                            ? 'border-gray-900 dark:border-gray-100' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: option.color }}
                        title={option.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* テンプレート選択 */}
          <Card>
            <CardHeader>
              <CardTitle>テンプレート選択</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                プロジェクトの種類に応じてテンプレートを選択すると、初期タスクが自動で作成されます
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.template === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{template.icon}</span>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    {template.defaultTasks.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">
                          初期タスク ({template.defaultTasks.length}個):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.defaultTasks.slice(0, 3).map((task, index) => (
                            <Badge key={index} variant="outline" size="sm">
                              {task}
                            </Badge>
                          ))}
                          {template.defaultTasks.length > 3 && (
                            <Badge variant="outline" size="sm">
                              +{template.defaultTasks.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* エラー表示 */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200">{errors.submit}</p>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex justify-end space-x-3">
            <Link href="/projects">
              <Button variant="outline" disabled={loading}>
                キャンセル
              </Button>
            </Link>
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  作成中...
                </>
              ) : (
                'プロジェクトを作成'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}