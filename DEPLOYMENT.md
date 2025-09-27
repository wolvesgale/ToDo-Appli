# デプロイメントガイド

## 概要
このドキュメントでは、ToDo共有アプリケーションをVercelにデプロイする手順を説明します。

## 前提条件
- GitHubアカウント
- Vercelアカウント
- AWS アカウント（DynamoDB、Cognito用）

## 環境変数の設定

### 必須環境変数
以下の環境変数をVercelの設定画面で設定してください：

```bash
# AWS設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# DynamoDB設定
DYNAMODB_TABLE_NAME=todo-app-main

# Cognito設定（オプション）
COGNITO_USER_POOL_ID=ap-northeast-1_XXXXXXXXX
COGNITO_CLIENT_ID=your-cognito-client-id
COGNITO_REGION=ap-northeast-1

# NextAuth設定
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# アプリケーション設定
APP_NAME=ToDo共有アプリ
APP_VERSION=1.0.0
NODE_ENV=production
```

## デプロイ手順

### 1. GitHubリポジトリの準備
```bash
git add .
git commit -m "feat: 本番環境デプロイ準備完了"
git push origin main
```

### 2. Vercelでのプロジェクト設定
1. Vercelダッシュボードにアクセス
2. "New Project"をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定
5. デプロイを実行

### 3. AWS リソースの設定

#### DynamoDB テーブル作成
```bash
# テーブル名: todo-app-main
# パーティションキー: PK (String)
# ソートキー: SK (String)
# GSI1: GSI1PK (String), GSI1SK (String)
```

#### Cognito設定（オプション）
- User Pool作成
- App Client作成
- 環境変数に設定値を追加

## 注意事項

### セキュリティ
- 環境変数は絶対にコードにハードコーディングしない
- AWS認証情報は適切な権限のみ付与
- NEXTAUTH_SECRETは強力なランダム文字列を使用

### パフォーマンス
- 静的ファイルはVercelのCDNを活用
- DynamoDBのRead/Write容量を適切に設定

### モニタリング
- Vercelのログを定期的に確認
- AWS CloudWatchでDynamoDBの使用状況を監視

## トラブルシューティング

### ビルドエラー
- 環境変数が正しく設定されているか確認
- TypeScriptエラーがないか確認

### 認証エラー
- Cognito設定が正しいか確認
- 環境変数の値が正確か確認

### データベース接続エラー
- AWS認証情報が正しいか確認
- DynamoDBテーブルが存在するか確認
- IAM権限が適切に設定されているか確認

## サポート
問題が発生した場合は、以下を確認してください：
1. Vercelのデプロイログ
2. ブラウザの開発者ツール
3. AWS CloudWatchログ