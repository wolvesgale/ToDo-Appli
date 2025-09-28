import { NextRequest, NextResponse } from 'next/server';
import { ProjectService, TaskService } from '@/lib/database';

// 顧客一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // プロジェクトの顧客データを取得（実装は簡略化）
    // 実際の実装では、Targetテーブルから取得
    const targets = [
      {
        id: '1',
        projectId,
        name: '田中太郎',
        displayName: '田中太郎',
        email: 'tanaka@example.com',
        order: 0,
        archived: false,
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return NextResponse.json({ success: true, data: targets });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DATABASE_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
      { status: 500 }
    );
  }
}

// 顧客追加
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const body = await request.json();
    
    const target = {
      id: Date.now().toString(),
      projectId,
      name: body.name,
      displayName: body.displayName || body.name,
      email: body.email || '',
      order: body.order || 0,
      archived: false,
      metadata: body.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 実際の実装では、DynamoDBに保存
    // await TargetService.create(target);
    
    return NextResponse.json({ success: true, data: target });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DATABASE_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
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
    const projectId = params.id;
    const body = await request.json();
    
    const updatedTarget = {
      ...body,
      projectId,
      updatedAt: new Date().toISOString()
    };
    
    // 実際の実装では、DynamoDBを更新
    // await TargetService.update(projectId, body.id, updatedTarget);
    
    return NextResponse.json({ success: true, data: updatedTarget });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DATABASE_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
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
    const projectId = params.id;
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get('targetId');
    
    if (!targetId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_TARGET_ID', message: 'Target ID is required' } },
        { status: 400 }
      );
    }
    
    // 実際の実装では、DynamoDBから削除
    // await TargetService.delete(projectId, targetId);
    
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DATABASE_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        } 
      },
      { status: 500 }
    );
  }
}