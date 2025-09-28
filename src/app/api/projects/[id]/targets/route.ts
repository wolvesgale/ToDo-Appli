import { NextRequest, NextResponse } from 'next/server';

// 環境変数をチェックして適切なサービスを選択
const isDevelopment = process.env.NODE_ENV === 'development';
const hasAWSCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

let TargetService: any;

if (isDevelopment && !hasAWSCredentials) {
  // 開発環境でAWS認証情報がない場合はモックサービスを使用
  const { MockTargetService } = require('@/lib/mock-dynamodb');
  TargetService = MockTargetService;
} else {
  // 本番環境または認証情報がある場合は実際のDynamoDBサービスを使用
  const { TargetService: RealTargetService } = require('@/lib/target-service');
  TargetService = RealTargetService;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const projectId = id;
    
    // ターゲット一覧を取得
    const targets = await TargetService.getByProject(projectId);

    return NextResponse.json({ success: true, data: targets });
  } catch (error) {
    console.error('Error fetching targets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch targets' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const projectId = id;
    const body = await request.json();
    
    // ターゲットを作成
    const target = await TargetService.create({
      projectId,
      name: body.name,
      displayName: body.displayName,
      email: body.email,
      order: body.order || 0,
      archived: false,
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, data: target });
  } catch (error) {
    console.error('Error creating target:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create target' },
      { status: 500 }
    );
  }
}

// 顧客更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const projectId = id;
    const body = await request.json();
    
    // ターゲットを更新
    const target = await TargetService.update(body.targetId, {
      name: body.name,
      description: body.description,
      status: body.status,
    });

    return NextResponse.json({ success: true, data: target });
  } catch (error) {
    console.error('Error updating target:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update target' },
      { status: 500 }
    );
  }
}

// 顧客削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const projectId = id;
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');

    if (!targetId) {
      return NextResponse.json(
        { success: false, error: 'Target ID is required' },
        { status: 400 }
      );
    }

    // ターゲットを削除
    await TargetService.delete(targetId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting target:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete target' },
      { status: 500 }
    );
  }
}