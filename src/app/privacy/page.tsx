'use client';

import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← ホームに戻る
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            プライバシーポリシー
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              最終更新日: 2024年1月1日
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                1. 個人情報の収集について
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                当サービス「ToDo共有」では、サービスの提供にあたり、以下の個人情報を収集する場合があります：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>氏名</li>
                <li>メールアドレス</li>
                <li>組織名</li>
                <li>利用状況に関する情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2. 個人情報の利用目的
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                収集した個人情報は、以下の目的で利用いたします：
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>サービスの提供・運営</li>
                <li>ユーザーサポート</li>
                <li>サービスの改善・開発</li>
                <li>重要なお知らせの配信</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                3. 個人情報の第三者提供
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                4. 個人情報の管理
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                当社は、個人情報の漏洩、滅失、毀損を防止するため、適切な安全管理措置を講じます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                5. 個人情報の開示・訂正・削除
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                ユーザーは、自身の個人情報について、開示・訂正・削除を求めることができます。
                ご希望の場合は、お問い合わせフォームよりご連絡ください。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                6. プライバシーポリシーの変更
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                当社は、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                7. お問い合わせ
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                本プライバシーポリシーに関するお問い合わせは、以下までご連絡ください：
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  サービス名: ToDo共有<br />
                  運営者: ToDo共有運営チーム<br />
                  お問い合わせ: support@todo-sharing.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}