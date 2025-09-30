// モックDynamoDBサービス（開発環境用）

export interface Target {
  id: string;
  projectId: string;
  name: string;
  displayName: string;
  email: string;
  order: number;
  archived: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
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

// インメモリストレージ
let mockTargets: Target[] = [
  {
    id: '1',
    projectId: '1',
    name: 'target1',
    displayName: 'ターゲット1',
    email: 'target1@example.com',
    order: 1,
    archived: false,
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    projectId: '1',
    name: 'target2',
    displayName: 'ターゲット2',
    email: 'target2@example.com',
    order: 2,
    archived: false,
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockProjects: Project[] = [
  {
    id: '1',
    name: 'サンプルプロジェクト1',
    description: 'これはサンプルプロジェクトです',
    ownerId: 'user1',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      isPublic: false,
      allowGuestAccess: false,
    },
  },
  {
    id: '2',
    name: 'サンプルプロジェクト2',
    description: 'これは2番目のサンプルプロジェクトです',
    ownerId: 'user1',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      isPublic: false,
      allowGuestAccess: false,
    },
  },
];

// ユーティリティ関数
const generateId = () => Date.now().toString();
const getCurrentTimestamp = () => new Date().toISOString();

export class MockTargetService {
  // 顧客作成
  static async create(targetData: Omit<Target, 'id' | 'createdAt' | 'updatedAt'>): Promise<Target> {
    const target: Target = {
      ...targetData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockTargets.push(target);
    return target;
  }

  // プロジェクトの顧客一覧取得
  static async getByProject(projectId: string): Promise<Target[]> {
    return mockTargets.filter(target => target.projectId === projectId);
  }

  // 顧客取得
  static async get(projectId: string, targetId: string): Promise<Target | null> {
    return mockTargets.find(target => target.projectId === projectId && target.id === targetId) || null;
  }

  // 顧客更新
  static async update(projectId: string, targetId: string, updates: Partial<Target>): Promise<Target> {
    const targetIndex = mockTargets.findIndex(target => target.projectId === projectId && target.id === targetId);
    if (targetIndex === -1) {
      throw new Error('Target not found');
    }

    mockTargets[targetIndex] = {
      ...mockTargets[targetIndex],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };

    return mockTargets[targetIndex];
  }

  // 顧客削除
  static async delete(projectId: string, targetId: string): Promise<void> {
    mockTargets = mockTargets.filter(target => !(target.projectId === projectId && target.id === targetId));
  }
}

// Task型をインポート
import { Task } from '@/types/database';

// モックタスクデータ
let mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'サンプルタスク1',
    description: 'これはサンプルタスクです',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'user1',
    createdBy: 'user1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    dueDate: '2024-01-25',
    tags: ['サンプル', 'テスト'],
    matrix: {
      importance: 'high',
      urgency: 'high'
    }
  },
  {
    id: '2',
    projectId: '1',
    title: 'サンプルタスク2',
    description: '2番目のサンプルタスクです',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'user2',
    createdBy: 'user1',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    dueDate: '2024-01-30',
    tags: ['サンプル', 'テスト'],
    matrix: {
      importance: 'high',
      urgency: 'low'
    }
  },
  {
    id: '3',
    projectId: '2',
    title: 'プロジェクト2のタスク',
    description: 'プロジェクト2用のタスクです',
    status: 'done',
    priority: 'low',
    assigneeId: 'user1',
    createdBy: 'user2',
    createdAt: '2024-01-17T14:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    dueDate: '2024-01-20',
    completedAt: '2024-01-18T16:00:00Z',
    tags: ['完了'],
    matrix: {
      importance: 'low',
      urgency: 'low'
    }
  }
];

export class MockTaskService {
  // タスク作成
  static async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockTasks.push(task);
    return task;
  }

  // プロジェクトのタスク一覧取得
  static async getByProjectId(projectId: string): Promise<Task[]> {
    return mockTasks.filter(task => task.projectId === projectId);
  }

  // タスク取得
  static async getById(projectId: string, taskId: string): Promise<Task | null> {
    return mockTasks.find(task => task.projectId === projectId && task.id === taskId) || null;
  }

  // タスク更新
  static async update(projectId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = mockTasks.findIndex(task => task.projectId === projectId && task.id === taskId);
    if (taskIndex === -1) {
      return null;
    }

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };

    return mockTasks[taskIndex];
  }

  // タスク削除
  static async delete(projectId: string, taskId: string): Promise<boolean> {
    const initialLength = mockTasks.length;
    mockTasks = mockTasks.filter(task => !(task.projectId === projectId && task.id === taskId));
    return mockTasks.length < initialLength;
  }
}

export class MockProjectService {
  // プロジェクト作成
  static async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const project: Project = {
      ...projectData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockProjects.push(project);
    return project;
  }

  // ユーザーのプロジェクト一覧取得
  static async getByUserId(userId: string): Promise<Project[]> {
    return mockProjects.filter(project => project.ownerId === userId);
  }

  // プロジェクト取得
  static async getById(projectId: string): Promise<Project | null> {
    return mockProjects.find(project => project.id === projectId) || null;
  }

  // プロジェクト更新
  static async update(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    const projectIndex = mockProjects.findIndex(project => project.id === projectId);
    if (projectIndex === -1) {
      return null;
    }

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };

    return mockProjects[projectIndex];
  }

  // プロジェクト削除
  static async delete(projectId: string): Promise<void> {
    mockProjects = mockProjects.filter(project => project.id !== projectId);
  }
}

// User型をインポート
import { User } from '@/types/database';

// モックユーザーデータ
let mockUsers: User[] = [
  {
    id: 'user1',
    email: 'admin@example.com',
    name: '田中太郎',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isActive: true,
    subscription: {
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    }
  },
  {
    id: 'user2',
    email: 'user@example.com',
    name: '佐藤花子',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    isActive: true,
    subscription: {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    }
  },
  {
    id: 'user3',
    email: 'suzuki@example.com',
    name: '鈴木一郎',
    createdAt: '2024-01-17T14:00:00Z',
    updatedAt: '2024-01-17T14:00:00Z',
    isActive: true,
    subscription: {
      plan: 'free',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    }
  },
  {
    id: 'user4',
    email: 'yamada@example.com',
    name: '山田美咲',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
    isActive: true,
    subscription: {
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    }
  },
  {
    id: 'user5',
    email: 'watanabe@example.com',
    name: '渡辺健太',
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
    isActive: true,
    subscription: {
      plan: 'enterprise',
      status: 'active',
      currentPeriodEnd: '2024-12-31T23:59:59Z'
    }
  }
];

export class MockUserService {
  // ユーザー作成
  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    mockUsers.push(user);
    return user;
  }

  // 全ユーザー取得
  static async getAll(): Promise<User[]> {
    return mockUsers.filter(user => user.isActive);
  }

  // ユーザー取得（ID）
  static async getById(userId: string): Promise<User | null> {
    return mockUsers.find(user => user.id === userId && user.isActive) || null;
  }

  // ユーザー取得（メールアドレス）
  static async getByEmail(email: string): Promise<User | null> {
    return mockUsers.find(user => user.email === email && user.isActive) || null;
  }

  // ユーザー検索（名前部分一致）
  static async searchByName(nameQuery: string, limit: number = 20): Promise<User[]> {
    return mockUsers
      .filter(user => user.isActive && user.name.includes(nameQuery))
      .slice(0, limit);
  }

  // ユーザー更新
  static async update(userId: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return null;
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: getCurrentTimestamp(),
    };

    return mockUsers[userIndex];
  }

  // ユーザー削除（論理削除）
  static async delete(userId: string): Promise<boolean> {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return false;
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      isActive: false,
      updatedAt: getCurrentTimestamp(),
    };

    return true;
  }

  // プロジェクトメンバー候補取得（プロジェクトに参加していないユーザー）
  static async getAvailableMembers(projectId: string): Promise<User[]> {
    // 実際の実装では、プロジェクトメンバーテーブルと結合して除外する
    // ここでは簡易実装として全ユーザーを返す
    return mockUsers.filter(user => user.isActive);
  }
}