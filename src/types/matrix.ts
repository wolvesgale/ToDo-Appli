// 新しいマトリクス構造の型定義

// 工程（Stage）の型定義
export interface Stage {
  id: string;
  projectId: string;
  name: string;
  order: number;
  color?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 対象者（Target/顧客）の型定義
export interface Target {
  id: string;
  projectId: string;
  name: string;
  displayName: string;
  email?: string;
  phone?: string;
  metadata: Record<string, any>; // CSVインポート時の追加データ
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// タスクの状態
export type TaskStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'error';

// アクションアイテム
export interface ActionItem {
  key: string;
  name: string;
  description?: string;
  category?: string;
  isDefault: boolean;
  createdAt: string;
}

// マトリクスタスク（セル）の型定義
export interface MatrixTask {
  id: string;
  projectId: string;
  stageId: string;
  targetId: string;
  status: TaskStatus;
  dueDate?: string;
  assignees: string[]; // ユーザーIDの配列
  actionKey?: string; // ActionItemのkey
  note?: string;
  attachments: TaskAttachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 添付ファイル
export interface TaskAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string; // プリサインドURL
}

// マトリクス表示用のデータ構造
export interface MatrixData {
  stages: Stage[];
  targets: Target[];
  tasks: MatrixTask[];
  actionCatalog: ActionItem[];
  projectMembers: ProjectMember[];
}

// プロジェクトメンバー（既存の型を拡張）
export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  joinedAt: string;
}

// CSVインポート用の型
export interface CSVImportMapping {
  projectId: string;
  fieldMappings: {
    name: string;
    displayName?: string;
    email?: string;
    phone?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

// UI状態管理用の型
export interface MatrixViewState {
  selectedCell?: {
    stageId: string;
    targetId: string;
  };
  showCompletedTasks: boolean;
  filterByAssignee?: string;
  filterByStatus?: TaskStatus[];
  sortBy: 'dueDate' | 'status' | 'assignee' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// バッジ表示用の型
export interface TaskBadge {
  type: 'overdue' | 'due_this_week' | 'assigned_to_me';
  count: number;
  color: string;
}

// 通知ルール
export interface NotificationRule {
  id: string;
  projectId: string;
  name: string;
  trigger: 'task_created' | 'task_updated' | 'due_date_approaching' | 'task_overdue';
  conditions: {
    stageIds?: string[];
    assigneeIds?: string[];
    daysBeforeDue?: number;
  };
  actions: {
    email: boolean;
    inApp: boolean;
    recipients: string[]; // ユーザーIDの配列
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 工程テンプレート
export interface StageTemplate {
  id: string;
  name: string;
  description?: string;
  stages: {
    name: string;
    order: number;
    color?: string;
    description?: string;
  }[];
  category: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}