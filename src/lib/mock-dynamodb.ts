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
    description: '別のサンプルプロジェクトです',
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