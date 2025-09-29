'use client';

import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

export default function PricingPage() {
  const plans = [
    {
      name: 'フリー',
      price: '¥0',
      period: '永久無料',
      description: '個人利用に最適',
      features: [
        '最大3つのプロジェクト',
        '基本的なタスク管理',
        'メール通知',
        'コミュニティサポート'
      ],
      buttonText: '無料で始める',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: 'プロ',
      price: '¥980',
      period: '月額',
      description: 'チーム利用に最適',
      features: [
        '無制限のプロジェクト',
        '高度なタスク管理',
        'リアルタイム通知',
        'チームコラボレーション',
        'レポート機能',
        '優先サポート'
      ],
      buttonText: '14日間無料トライアル',
      buttonVariant: 'primary' as const,
      popular: true
    },
    {
      name: 'エンタープライズ',
      price: '¥2,980',
      period: '月額',
      description: '大規模組織向け',
      features: [
        'プロプランの全機能',
        'カスタムワークフロー',
        'API アクセス',
        'シングルサインオン (SSO)',
        '専用サポート',
        'オンプレミス対応'
      ],
      buttonText: 'お問い合わせ',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            料金プラン
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            あなたのニーズに合わせた最適なプランをお選びください
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative h-full ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    人気プラン
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-1">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Link href="/auth/signup">
                    <Button 
                      variant={plan.buttonVariant}
                      className="w-full"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            よくある質問
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">無料プランの制限はありますか？</h3>
              <p className="text-gray-600 dark:text-gray-400">
                無料プランでは最大3つのプロジェクトまで作成できます。基本的なタスク管理機能は全て利用可能です。
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">プランの変更はいつでも可能ですか？</h3>
              <p className="text-gray-600 dark:text-gray-400">
                はい、いつでもプランの変更が可能です。アップグレード・ダウングレードともに即座に反映されます。
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-2">支払い方法は何が利用できますか？</h3>
              <p className="text-gray-600 dark:text-gray-400">
                クレジットカード（Visa、MasterCard、JCB、American Express）、銀行振込に対応しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}