import { NextRequest, NextResponse } from 'next/server';

// 環境変数をチェックして適切なサービスを選択
const isDevelopment = process.env.NODE_ENV === 'development';
const hasAWSCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

let ProjectService: any;

if (isDevelopment && !hasAWSCredentials) {
  // 開発環境でAWS認証情報がない場合はモックサービスを使用
  const { MockProjectService } = require('@/lib/mock-dynamodb');
  ProjectService = MockProjectService;
} else {
  // 本番環境または認証情報がある場合は実際のDynamoDBサービスを使用
  const { ProjectService: RealProjectService } = require('@/lib/database');
  ProjectService = RealProjectService;
}

export async function GET(request: NextRequest) {
  try {
    // 開発環境では認証チェックをスキップ
    const userId = 'user1'; // 開発用の固定ユーザーID
    
    // プロジェクト一覧を取得
    const projects = await ProjectService.getByUserId(userId);

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'user1'; // 開発用の固定ユーザーID

    // プロジェクトを作成
    const project = await ProjectService.create({
      name: body.name,
      description: body.description,
      ownerId: userId,
      status: 'active',
      settings: {
        isPublic: false,
        allowComments: true,
        theme: 'default'
      }
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    if (isDevelopment && !hasAWSCredentials) {
      // モックサービスを使用
      await ProjectService.delete(projectId);
    } else {
      // 実際のDynamoDBから削除
      const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
      const { DynamoDBClient } = await import('@aws-sdk/client-dynamodb');
      const { DynamoDBDocumentClient } = await import('@aws-sdk/lib-dynamodb');
      
      const client = new DynamoDBClient({
        region: process.env.AWS_REGION || 'ap-northeast-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      });
      
      const docClient = DynamoDBDocumentClient.from(client);
      
      const deleteCommand = new DeleteCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          PK: `PROJECT#${projectId}`,
          SK: `PROJECT#${projectId}`
        }
      });

      await docClient.send(deleteCommand);
    }

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}