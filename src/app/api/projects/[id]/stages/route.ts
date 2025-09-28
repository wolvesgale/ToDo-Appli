import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/database';

// 工程一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    
    // プロジェクトの工程データを取得（実装は簡略化）
    const stages = [
      {
        id: '1',
        projectId,
        name: '要件定義',
        description: 'システムの要件を定義する',
        order: 0,
        color: '#3B82F6',
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return NextResponse.json({ success: true, data: stages });
  });
}

// 工程追加
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    const body = await request.json();
    
    const stage = {
      id: Date.now().toString(),
      projectId,
      name: body.name,
      description: body.description || '',
      order: body.order || 0,
      color: body.color || '#3B82F6',
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 実際の実装では、DynamoDBに保存
    // await StageService.create(stage);
    
    return NextResponse.json({ success: true, data: stage });
  });
}

// 工程更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    const body = await request.json();
    
    const updatedStage = {
      ...body,
      projectId,
      updatedAt: new Date().toISOString()
    };
    
    // 実際の実装では、DynamoDBを更新
    // await StageService.update(projectId, body.id, updatedStage);
    
    return NextResponse.json({ success: true, data: updatedStage });
  });
}

// 工程削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    const { searchParams } = new URL(request.url);
    const stageId = searchParams.get('stageId');
    
    if (!stageId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_STAGE_ID', message: 'Stage ID is required' } },
        { status: 400 }
      );
    }
    
    // 実際の実装では、DynamoDBから削除
    // await StageService.delete(projectId, stageId);
    
    return NextResponse.json({ success: true, data: { deleted: true } });
  });
}