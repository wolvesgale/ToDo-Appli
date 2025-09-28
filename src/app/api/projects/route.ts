import { NextRequest, NextResponse } from 'next/server';

// サービスを動的に取得する関数
function getProjectService() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasAWSCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

  try {
    if (isDevelopment && !hasAWSCredentials) {
      // 開発環境でAWS認証情報がない場合はモックサービスを使用
      const { MockProjectService } = require('@/lib/mock-dynamodb');
      return MockProjectService;
    } else {
      // 本番環境または認証情報がある場合は実際のDynamoDBサービスを使用
      const { ProjectService: RealProjectService } = require('@/lib/database');
      return RealProjectService;
    }
  } catch (error) {
    console.error('Error loading project service:', error);
    // フォールバックとしてモックサービスを使用
    const { MockProjectService } = require('@/lib/mock-dynamodb');
    return MockProjectService;
  }
}

export async function GET(request: NextRequest) {
  try {
    const ProjectService = getProjectService();
    
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
    const ProjectService = getProjectService();
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
        allowGuestAccess: false,
      },
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
    const ProjectService = getProjectService();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // プロジェクトを削除
    await ProjectService.delete(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}