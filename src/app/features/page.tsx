'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function FeaturesPage() {
  const features = [
    {
      title: 'プロジェクト管理',
      description: 'チームでのプロジェクト管理を効率化。タスクの進捗を可視化し、デッドラインを管理できます。',
      icon: '📊'
    },
    {
      title: 'リアルタイム通知',
      description: 'プロジェクトの更新やタスクの変更をリアルタイムで通知。チーム全体で情報を共有できます。',
      icon: '🔔'
    },
    {
      title: 'チームコラボレーション',
      description: 'メンバー招待、権限管理、コメント機能でチームワークを向上させます。',
      icon: '👥'
    },
    {
      title: 'カスタマイズ可能',
      description: 'プロジェクトテンプレート、カラーテーマ、ワークフローをカスタマイズできます。',
      icon: '⚙️'
    },
    {
      title: 'レポート機能',
      description: '進捗レポート、パフォーマンス分析、時間追跡で生産性を向上させます。',
      icon: '📈'
    },
    {
      title: 'セキュリティ',
      description: 'エンタープライズレベルのセキュリティでデータを保護します。',
      icon: '🔒'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            機能一覧
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ToDoアプリの豊富な機能で、あなたのプロジェクト管理を次のレベルへ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            さらに多くの機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">基本機能</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>✓ タスク作成・編集・削除</li>
                <li>✓ 優先度設定</li>
                <li>✓ 期限管理</li>
                <li>✓ カテゴリ分類</li>
                <li>✓ 検索・フィルタリング</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">高度な機能</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>✓ ガントチャート</li>
                <li>✓ カンバンボード</li>
                <li>✓ 時間追跡</li>
                <li>✓ ファイル添付</li>
                <li>✓ API連携</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}