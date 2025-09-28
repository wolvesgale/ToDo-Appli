import { NextRequest, NextResponse } from 'next/server';

// サービスを動的に取得する関数
async function getProjectService() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasAWSCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

  try {
    if (isDevelopment && !hasAWSCredentials) {
      // 開発環境でAWS認証情報がない場合はモックサービスを使用
      const { MockProjectService } = await import('@/lib/mock-dynamodb');
      return MockProjectService;
    } else {
      // 本番環境または認証情報がある場合は実際のDynamoDBサービスを使用
      const { ProjectService: RealProjectService } = await import('@/lib/database');
      return RealProjectService;
    }
  } catch (error) {
    console.error('Error loading project service:', error);
    // フォールバックとしてモックサービスを使用
    try {
      const { MockProjectService } = await import('@/lib/mock-dynamodb');
      return MockProjectService;
    } catch (fallbackError) {
      console.error('Error loading fallback service:', fallbackError);
      throw new Error('Failed to load any project service');
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const ProjectService = await getProjectService();
    
    // 開発環境では認証チェックをスキップ
    const userId = 'user1'; // 開発用の固定ユーザーID
    
    // プロジェクト一覧を取得
    const projects = await ProjectService.getByUserId(userId);

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ProjectService = await getProjectService();
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
        allowGuestAccess: false,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}