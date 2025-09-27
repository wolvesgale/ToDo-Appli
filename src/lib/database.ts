// DynamoDB接続とデータベース操作

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { User, Project, Task, ProjectMember, Notification, Invitation, ApiResponse, QueryParams } from '@/types/database';

// DynamoDB クライアントの設定
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// テーブル名
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'todo-app-table';

// ユーティリティ関数
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// ユーザー操作
export class UserService {
  static async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `USER#${user.id}`,
        SK: 'PROFILE',
        ...user,
      },
    });

    await docClient.send(command);
    return user;
  }

  static async getById(userId: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
    });

    const result = await docClient.send(command);
    if (!result.Item) return null;

    const { PK, SK, ...user } = result.Item;
    return user as User;
  }

  static async update(userId: string, updates: Partial<User>): Promise<User | null> {
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    }

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = getCurrentTimestamp();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE',
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    if (!result.Attributes) return null;

    const { PK, SK, ...user } = result.Attributes;
    return user as User;
  }
}

// プロジェクト操作
export class ProjectService {
  static async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const project: Project = {
      ...projectData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `PROJECT#${project.id}`,
        SK: 'METADATA',
        ...project,
      },
    });

    await docClient.send(command);
    return project;
  }

  static async getById(projectId: string): Promise<Project | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: 'METADATA',
      },
    });

    const result = await docClient.send(command);
    if (!result.Item) return null;

    const { PK, SK, ...project } = result.Item;
    return project as Project;
  }

  static async getByUserId(userId: string): Promise<Project[]> {
    // ユーザーが参加しているプロジェクトを取得
    const memberCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1', // GSI1: userId をキーとするインデックス
      KeyConditionExpression: 'GSI1PK = :userId AND begins_with(GSI1SK, :memberPrefix)',
      ExpressionAttributeValues: {
        ':userId': `USER#${userId}`,
        ':memberPrefix': 'MEMBER#',
      },
    });

    const memberResult = await docClient.send(memberCommand);
    const projectIds = memberResult.Items?.map(item => item.projectId) || [];

    if (projectIds.length === 0) return [];

    // プロジェクトの詳細情報を取得
    const projects: Project[] = [];
    for (const projectId of projectIds) {
      const project = await this.getById(projectId);
      if (project) projects.push(project);
    }

    return projects;
  }

  static async update(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    }

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = getCurrentTimestamp();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: 'METADATA',
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    if (!result.Attributes) return null;

    const { PK, SK, ...project } = result.Attributes;
    return project as Project;
  }
}

// タスク操作
export class TaskService {
  static async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const task: Task = {
      ...taskData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `PROJECT#${task.projectId}`,
        SK: `TASK#${task.id}`,
        ...task,
      },
    });

    await docClient.send(command);
    return task;
  }

  static async getById(projectId: string, taskId: string): Promise<Task | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`,
      },
    });

    const result = await docClient.send(command);
    if (!result.Item) return null;

    const { PK, SK, ...task } = result.Item;
    return task as Task;
  }

  static async getByProjectId(projectId: string, params?: QueryParams): Promise<Task[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :projectId AND begins_with(SK, :taskPrefix)',
      ExpressionAttributeValues: {
        ':projectId': `PROJECT#${projectId}`,
        ':taskPrefix': 'TASK#',
      },
      Limit: params?.limit || 50,
    });

    const result = await docClient.send(command);
    return result.Items?.map(item => {
      const { PK, SK, ...task } = item;
      return task as Task;
    }) || [];
  }

  static async update(projectId: string, taskId: string, updates: Partial<Task>): Promise<Task | null> {
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'projectId' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    }

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = getCurrentTimestamp();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`,
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    if (!result.Attributes) return null;

    const { PK, SK, ...task } = result.Attributes;
    return task as Task;
  }

  static async delete(projectId: string, taskId: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`,
      },
    });

    try {
      await docClient.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }
}

// プロジェクトメンバー操作
export class ProjectMemberService {
  static async addMember(memberData: Omit<ProjectMember, 'joinedAt'>): Promise<ProjectMember> {
    const member: ProjectMember = {
      ...memberData,
      joinedAt: getCurrentTimestamp(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `PROJECT#${member.projectId}`,
        SK: `MEMBER#${member.userId}`,
        GSI1PK: `USER#${member.userId}`,
        GSI1SK: `MEMBER#${member.projectId}`,
        ...member,
      },
    });

    await docClient.send(command);
    return member;
  }

  static async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :projectId AND begins_with(SK, :memberPrefix)',
      ExpressionAttributeValues: {
        ':projectId': `PROJECT#${projectId}`,
        ':memberPrefix': 'MEMBER#',
      },
    });

    const result = await docClient.send(command);
    return result.Items?.map(item => {
      const { PK, SK, GSI1PK, GSI1SK, ...member } = item;
      return member as ProjectMember;
    }) || [];
  }
}

// エラーハンドリング用のラッパー関数
export const withErrorHandling = async <T>(
  operation: () => Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    const data = await operation();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Database operation error:', error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown database error',
      },
    };
  }
};