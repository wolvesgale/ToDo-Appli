# トラブルシューティングガイド

## Vercel 500エラーの解決記録

### 問題の概要
- **発生日時**: 2025年9月28日
- **症状**: ローカル環境では正常に動作するが、Vercelデプロイ後にプロジェクト一覧API (`/api/projects`) が500エラーを返す
- **エラーメッセージ**: `GET https://todo-app-phi-flax-61.vercel.app/api/projects 500 (Internal Server Error)`

### 根本原因
Next.js APIルートでの動的モジュール読み込みにおいて、`require()` を使用していたことが原因。Vercel環境では `require()` による動的読み込みが正常に動作しない場合がある。

### 解決方法
1. **動的インポートの修正**
   - `require()` を `import()` に変更
   - 非同期処理に対応するため関数を `async` に変更

2. **エラーハンドリングの改善**
   - フォールバック機能の追加
   - より詳細なエラーメッセージの提供

### 修正内容

#### Before (問題のあるコード)
```typescript
function getProjectService() {
  try {
    if (isDevelopment && !hasAWSCredentials) {
      const { MockProjectService } = require('@/lib/mock-dynamodb');
      return MockProjectService;
    } else {
      const { ProjectService: RealProjectService } = require('@/lib/database');
      return RealProjectService;
    }
  } catch (error) {
    const { MockProjectService } = require('@/lib/mock-dynamodb');
    return MockProjectService;
  }
}
```

#### After (修正後のコード)
```typescript
async function getProjectService() {
  try {
    if (isDevelopment && !hasAWSCredentials) {
      const { MockProjectService } = await import('@/lib/mock-dynamodb');
      return MockProjectService;
    } else {
      const { ProjectService: RealProjectService } = await import('@/lib/database');
      return RealProjectService;
    }
  } catch (error) {
    try {
      const { MockProjectService } = await import('@/lib/mock-dynamodb');
      return MockProjectService;
    } catch (fallbackError) {
      throw new Error('Failed to load any project service');
    }
  }
}
```

### 既存機能の保護状況
以下の機能が正常に保持されていることを確認済み：

1. **マトリクス表示機能**
   - `/projects/[id]/matrix` ページが存在
   - 顧客×工程のマトリクス形式での進捗表示
   - タスクの重要度・緊急度による分類

2. **タスク管理機能**
   - 重要度・緊急度のマトリクス分類
   - タスクの状態管理（todo, in_progress, done, archived）
   - 優先度設定（low, medium, high, urgent）

3. **プロジェクト管理機能**
   - プロジェクト一覧表示
   - プロジェクト作成・編集
   - メンバー管理

### 今後の注意点
1. **動的インポート**
   - Next.js APIルートでは `import()` を使用する
   - `require()` は避ける

2. **エラーハンドリング**
   - フォールバック機能を必ず実装
   - 詳細なエラーメッセージを提供

3. **環境差異**
   - ローカルとVercelで動作が異なる場合がある
   - 本番環境でのテストを必ず実施

### 関連ファイル
- `/src/app/api/projects/route.ts` - メイン修正ファイル
- `/src/lib/mock-dynamodb.ts` - モックサービス
- `/src/lib/database.ts` - 実際のDynamoDBサービス

### 参考リンク
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Vercel Deployment Issues](https://vercel.com/docs/concepts/deployments/troubleshoot-a-deployment)