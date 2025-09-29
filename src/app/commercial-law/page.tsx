'use client';

import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout';

export default function CommercialLawPage() {
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
            特定商取引法に基づく表記
          </h1>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              最終更新日: 2024年1月1日
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                販売業者
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  ToDo共有運営チーム
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                運営責任者
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  代表者名: 運営責任者
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                所在地
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  〒000-0000<br />
                  東京都○○区○○ 1-1-1
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                連絡先
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  電話番号: 03-0000-0000<br />
                  メールアドレス: support@todo-sharing.com<br />
                  受付時間: 平日 9:00-18:00（土日祝日を除く）
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                販売価格
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  年額 200円（税込）<br />
                  ※価格は予告なく変更される場合があります
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                支払方法
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  クレジットカード決済<br />
                  ※対応カード: VISA、MasterCard、JCB、American Express、Diners Club
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                支払時期
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  年額プランの場合: 契約時に一括払い<br />
                  自動更新: 契約期間満了時に自動的に更新されます
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                サービス提供時期
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  決済完了後、即座にサービスをご利用いただけます
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                返品・キャンセルについて
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  デジタルサービスの性質上、原則として返品・返金はお受けできません。<br />
                  ただし、サービスに重大な不具合がある場合は、個別に対応いたします。<br />
                  解約をご希望の場合は、契約期間満了前にお手続きください。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                その他
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-700 dark:text-gray-300">
                  本サービスの利用に関しては、別途定める利用規約が適用されます。<br />
                  お客様の個人情報の取り扱いについては、プライバシーポリシーをご確認ください。
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}