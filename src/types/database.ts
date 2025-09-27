// データベース関連の型定義

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  settings: {
    isPublic: boolean;
    allowGuestAccess: boolean;
  };
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  invitedBy: string;
  status: 'active' | 'invited' | 'removed';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  tags: string[];
  // マトリクス位置（重要度・緊急度）
  matrix: {
    importance: 'high' | 'low';
    urgency: 'high' | 'low';
  };
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'task_completed' | 'project_invited' | 'due_date_reminder' | 'comment_added';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // タスクIDやプロジェクトID
  actionUrl?: string;
}

export interface Invitation {
  id: string;
  projectId: string;
  inviterUserId: string;
  inviteeEmail: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

// DynamoDB用のキー構造
export interface DynamoDBKeys {
  // ユーザー関連
  User: {
    PK: string; // USER#${userId}
    SK: string; // PROFILE
  };
  
  // プロジェクト関連
  Project: {
    PK: string; // PROJECT#${projectId}
    SK: string; // METADATA
  };
  
  ProjectMember: {
    PK: string; // PROJECT#${projectId}
    SK: string; // MEMBER#${userId}
  };
  
  // タスク関連
  Task: {
    PK: string; // PROJECT#${projectId}
    SK: string; // TASK#${taskId}
  };
  
  TaskComment: {
    PK: string; // TASK#${taskId}
    SK: string; // COMMENT#${commentId}
  };
  
  TaskAttachment: {
    PK: string; // TASK#${taskId}
    SK: string; // ATTACHMENT#${attachmentId}
  };
  
  // 通知関連
  Notification: {
    PK: string; // USER#${userId}
    SK: string; // NOTIFICATION#${notificationId}
  };
  
  // 招待関連
  Invitation: {
    PK: string; // PROJECT#${projectId}
    SK: string; // INVITATION#${invitationId}
  };
}

// API レスポンス用の型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

// クエリパラメータ用の型
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
}

// マトリクス表示用の型
export interface MatrixQuadrant {
  importance: 'high' | 'low';
  urgency: 'high' | 'low';
  label: string;
  description: string;
  color: string;
}

export interface MatrixData {
  quadrants: MatrixQuadrant[];
  tasks: {
    [key: string]: Task[]; // キーは "high-high", "high-low", "low-high", "low-low"
  };
}