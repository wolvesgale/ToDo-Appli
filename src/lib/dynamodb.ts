import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from './aws-config';
import { User, Tenant, Project, Task } from '@/types';

// 基本的なCRUD操作
export class DynamoDBService {
  
  // アイテムを取得
  async getItem(pk: string, sk: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk }
    });
    
    const result = await docClient.send(command);
    return result.Item;
  }

  // アイテムを作成/更新
  async putItem(item: Record<string, unknown>) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });
    
    await docClient.send(command);
    return item;
  }

  // アイテムを更新
  async updateItem(pk: string, sk: string, updates: Record<string, unknown>) {
    const updateExpression = Object.keys(updates)
      .map(key => `#${key} = :${key}`)
      .join(', ');
    
    const expressionAttributeNames = Object.keys(updates)
      .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});
    
    const expressionAttributeValues = Object.keys(updates)
      .reduce((acc, key) => ({ ...acc, [`:${key}`]: updates[key] }), {});

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(command);
    return result.Attributes;
  }

  // アイテムを削除
  async deleteItem(pk: string, sk: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk }
    });
    
    await docClient.send(command);
  }

  // クエリ実行
  async query(pk: string, skPrefix?: string, limit?: number) {
    const keyConditionExpression = skPrefix 
      ? 'PK = :pk AND begins_with(SK, :sk)'
      : 'PK = :pk';
    
    const expressionAttributeValues: Record<string, unknown> = { ':pk': pk };
    if (skPrefix) {
      expressionAttributeValues[':sk'] = skPrefix;
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit
    });

    const result = await docClient.send(command);
    return result.Items || [];
  }

  // GSIクエリ実行
  async queryGSI(indexName: string, pk: string, sk?: string, limit?: number) {
    const keyConditionExpression = sk 
      ? 'GSI1PK = :pk AND GSI1SK = :sk'
      : 'GSI1PK = :pk';
    
    const expressionAttributeValues: Record<string, unknown> = { ':pk': pk };
    if (sk) {
      expressionAttributeValues[':sk'] = sk;
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: indexName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: limit
    });

    const result = await docClient.send(command);
    return result.Items || [];
  }
}

// ユーザー操作
export class UserService extends DynamoDBService {
  
  async createUser(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString();
    const userItem = {
      PK: `USER#${user.id}`,
      SK: `USER#${user.id}`,
      ...user,
      createdAt: now,
      updatedAt: now
    };
    
    await this.putItem(userItem);
    return userItem as User;
  }

  async getUser(userId: string): Promise<User | null> {
    const item = await this.getItem(`USER#${userId}`, `USER#${userId}`);
    return item as User || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const updatedItem = await this.updateItem(
      `USER#${userId}`, 
      `USER#${userId}`, 
      { ...updates, updatedAt: new Date().toISOString() }
    );
    return updatedItem as User;
  }
}

// テナント操作
export class TenantService extends DynamoDBService {
  
  async createTenant(tenant: Omit<Tenant, 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    const now = new Date().toISOString();
    const tenantItem = {
      PK: `TENANT#${tenant.id}`,
      SK: `TENANT#${tenant.id}`,
      ...tenant,
      createdAt: now,
      updatedAt: now
    };
    
    await this.putItem(tenantItem);
    return tenantItem as Tenant;
  }

  async getTenant(tenantId: string): Promise<Tenant | null> {
    const item = await this.getItem(`TENANT#${tenantId}`, `TENANT#${tenantId}`);
    return item as Tenant || null;
  }
}

// プロジェクト操作
export class ProjectService extends DynamoDBService {
  
  async createProject(project: Omit<Project, 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date().toISOString();
    const projectItem = {
      PK: `TENANT#${project.tenantId}`,
      SK: `PROJECT#${project.id}`,
      GSI1PK: `USER#${project.createdBy}`,
      GSI1SK: `PROJECT#${project.id}`,
      ...project,
      createdAt: now,
      updatedAt: now
    };
    
    await this.putItem(projectItem);
    return projectItem as Project;
  }

  async getProject(tenantId: string, projectId: string): Promise<Project | null> {
    const item = await this.getItem(`TENANT#${tenantId}`, `PROJECT#${projectId}`);
    return item as Project || null;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    const items = await this.queryGSI('GSI1', `USER#${userId}`, 'PROJECT#');
    return items as Project[];
  }

  async getTenantProjects(tenantId: string): Promise<Project[]> {
    const items = await this.query(`TENANT#${tenantId}`, 'PROJECT#');
    return items as Project[];
  }
}

// タスク操作
export class TaskService extends DynamoDBService {
  
  async createTask(task: Omit<Task, 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const taskItem = {
      PK: `PROJECT#${task.projectId}#TARGET#${task.targetId}`,
      SK: `TASK#${task.stageId}`,
      GSI1PK: task.assignees.length > 0 ? `ASSIGNEE#${task.assignees[0]}` : undefined,
      GSI1SK: task.dueDate ? `DUE#${task.dueDate}#${task.projectId}#${task.targetId}#${task.stageId}` : undefined,
      ...task,
      createdAt: now,
      updatedAt: now
    };
    
    await this.putItem(taskItem);
    return taskItem as Task;
  }

  async getTask(projectId: string, targetId: string, stageId: string): Promise<Task | null> {
    const item = await this.getItem(
      `PROJECT#${projectId}#TARGET#${targetId}`, 
      `TASK#${stageId}`
    );
    return item as Task || null;
  }

  async getProjectTasks(projectId: string): Promise<Task[]> {
    const items = await this.query(`PROJECT#${projectId}`, 'TARGET#');
    return items.filter(item => item.SK?.startsWith('TASK#')) as Task[];
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    const items = await this.queryGSI('GSI1', `ASSIGNEE#${userId}`);
    return items as Task[];
  }
}

// サービスインスタンス
export const userService = new UserService();
export const tenantService = new TenantService();
export const projectService = new ProjectService();
export const taskService = new TaskService();