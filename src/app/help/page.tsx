'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全て' },
    { id: 'getting-started', name: '始め方' },
    { id: 'projects', name: 'プロジェクト管理' },
    { id: 'tasks', name: 'タスク管理' },
    { id: 'collaboration', name: 'チーム機能' },
    { id: 'account', name: 'アカウント設定' },
    { id: 'troubleshooting', name: 'トラブルシューティング' }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'アカウントの作成方法を教えてください',
      answer: 'トップページの「新規登録」ボタンをクリックし、メールアドレスとパスワードを入力してアカウントを作成できます。'
    },
    {
      category: 'projects',
      question: '新しいプロジェクトを作成するには？',
      answer: 'プロジェクト一覧ページで「新しいプロジェクト」ボタンをクリックし、プロジェクト名や説明を入力して作成できます。'
    },
    {
      category: 'tasks',
      question: 'タスクに優先度を設定できますか？',
      answer: 'はい、タスク作成・編集時に「高」「中」「低」の3段階で優先度を設定できます。'
    },
    {
      category: 'collaboration',
      question: 'チームメンバーを招待するには？',
      answer: 'プロジェクト設定ページで「メンバー招待」をクリックし、招待したいメンバーのメールアドレスを入力してください。'
    },
    {
      category: 'account',
      question: 'パスワードを変更したい',
      answer: 'アカウント設定ページの「セキュリティ」タブからパスワードを変更できます。'
    },
    {
      category: 'troubleshooting',
      question: 'ログインできません',
      answer: 'メールアドレスとパスワードが正しいか確認してください。パスワードを忘れた場合は「パスワードを忘れた方」リンクをクリックしてリセットできます。'
    },
    {
      category: 'projects',
      question: 'プロジェクトを削除するには？',
      answer: 'プロジェクト設定ページの「危険な操作」セクションから削除できます。削除したプロジェクトは復元できませんのでご注意ください。'
    },
    {
      category: 'tasks',
      question: 'タスクの期限を設定できますか？',
      answer: 'はい、タスク作成・編集時に期限日時を設定できます。期限が近づくと通知でお知らせします。'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            ヘルプセンター
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            ToDoアプリの使い方やよくある質問をご確認いただけます
          </p>
        </div>

        {/* 検索バー */}
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            type="text"
            placeholder="質問を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* カテゴリフィルター */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ一覧 */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                検索条件に一致する質問が見つかりませんでした。
              </p>
            </div>
          )}
        </div>

        {/* お問い合わせセクション */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>お探しの情報が見つかりませんか？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                お困りのことがございましたら、お気軽にお問い合わせください。
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">メールサポート</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    support@todoapp.com
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    24時間以内に返信いたします
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">チャットサポート</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    平日 9:00-18:00
                  </p>
                  <Button className="mt-2">
                    チャットを開始
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}