// ユーザー関連の型定義
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// テナント関連の型定義
export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// メンバーシップ関連の型定義
export interface Membership {
  tenantId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: string;
}

// プロジェクト関連の型定義
export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  stages: Stage[];
  actionCatalog: ActionItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

// ステージ（工程）関連の型定義
export interface Stage {
  id: string;
  projectId: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ターゲット（対象者）関連の型定義
export interface Target {
  id: string;
  projectId: string;
  name: string;
  displayName: string;
  metadata?: Record<string, unknown>;
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// タスク（セル）関連の型定義
export interface Task {
  id: string;
  projectId: string;
  targetId: string;
  stageId: string;
  status: TaskStatus;
  dueDate?: string;
  assignees: string[];
  actionKey?: string;
  note?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'error';

// アクション関連の型定義
export interface ActionItem {
  key: string;
  name: string;
  description?: string;
  createdAt: string;
}

// 添付ファイル関連の型定義
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  uploadedBy: string;
  uploadedAt: string;
}

// 監査ログ関連の型定義
export interface AuditLog {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  timestamp: string;
}

// API レスポンス関連の型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// フィルター・検索関連の型定義
export interface TaskFilter {
  assignee?: string;
  status?: TaskStatus[];
  dueFrom?: string;
  dueTo?: string;
  targetIds?: string[];
  stageIds?: string[];
}

// エクスポート関連の型定義
export interface ExportRequest {
  projectId: string;
  format: 'csv' | 'xlsx';
  includeCompleted?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

// 通知関連の型定義
export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  reminderDays: number[];
  dailyDigest: boolean;
  timezone: string;
}

// UI関連の型定義
export interface ViewSettings {
  showCompletedTasks: boolean;
  groupBy: 'none' | 'assignee' | 'status' | 'dueDate';
  sortBy: 'dueDate' | 'status' | 'assignee' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}