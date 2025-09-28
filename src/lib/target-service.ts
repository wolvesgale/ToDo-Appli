// Target（顧客）データのCRUD操作

import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// DynamoDB クライアントの設定
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'todo-app-table';

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

// ユーティリティ関数
const generateId = () => Date.now().toString();
const getCurrentTimestamp = () => new Date().toISOString();

export class TargetService {
  // 顧客作成
  static async create(targetData: Omit<Target, 'id' | 'createdAt' | 'updatedAt'>): Promise<Target> {
    const target: Target = {
      ...targetData,
      id: generateId(),
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `PROJECT#${target.projectId}`,
        SK: `TARGET#${target.id}`,
        ...target,
      },
    });

    await docClient.send(command);
    return target;
  }

  // プロジェクトの顧客一覧取得
  static async getByProject(projectId: string): Promise<Target[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :projectId AND begins_with(SK, :targetPrefix)',
      ExpressionAttributeValues: {
        ':projectId': `PROJECT#${projectId}`,
        ':targetPrefix': 'TARGET#',
      },
    });

    const result = await docClient.send(command);
    return result.Items?.map(item => {
      const { PK, SK, ...target } = item;
      return target as Target;
    }) || [];
  }

  // 顧客取得
  static async get(projectId: string, targetId: string): Promise<Target | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TARGET#${targetId}`,
      },
    });

    const result = await docClient.send(command);
    if (!result.Item) return null;

    const { PK, SK, ...target } = result.Item;
    return target as Target;
  }

  // 顧客更新
  static async update(projectId: string, targetId: string, updates: Partial<Target>): Promise<Target> {
    const updateExpression = 'SET #updatedAt = :updatedAt';
    const expressionAttributeNames: Record<string, string> = {
      '#updatedAt': 'updatedAt',
    };
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': getCurrentTimestamp(),
    };

    // 更新可能なフィールドを追加
    const updateableFields = ['name', 'displayName', 'email', 'order', 'archived', 'metadata'];
    const updateExpressions: string[] = [];

    updateableFields.forEach((field, index) => {
      if (updates[field as keyof Target] !== undefined) {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = field;
        expressionAttributeValues[attrValue] = updates[field as keyof Target];
      }
    });

    const finalUpdateExpression = updateExpressions.length > 0 
      ? `${updateExpression}, ${updateExpressions.join(', ')}`
      : updateExpression;

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TARGET#${targetId}`,
      },
      UpdateExpression: finalUpdateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await docClient.send(command);
    const { PK, SK, ...target } = result.Attributes!;
    return target as Target;
  }

  // 顧客削除
  static async delete(projectId: string, targetId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TARGET#${targetId}`,
      },
    });

    await docClient.send(command);
  }
}