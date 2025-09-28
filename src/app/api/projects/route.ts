import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/database';

// プロジェクト一覧取得
export async function GET(request: NextRequest) {
  try {
    // 実際の実装では、認証されたユーザーのプロジェクト一覧を取得
    const projects = [
      {
        id: '1',
        name: 'サンプルプロジェクト1',
        description: 'これはサンプルプロジェクトです',
        status: 'active',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        memberCount: 3,
        taskCount: 12
      },
      {
        id: '2',
        name: 'サンプルプロジェクト2',
        description: '別のサンプルプロジェクトです',
        status: 'active',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-20',
        memberCount: 2,
        taskCount: 8
      }
    ];
    
    return NextResponse.json({ success: true, data: projects });
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

// プロジェクト作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const project = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || '',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      memberCount: 1,
      taskCount: 0
    };
    
    // 実際の実装では、DynamoDBに保存
    // await ProjectService.create(project);
    
    return NextResponse.json({ success: true, data: project });
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

// プロジェクト削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PROJECT_ID', message: 'Project ID is required' } },
        { status: 400 }
      );
    }
    
    // 実際の実装では、DynamoDBから削除
    // await ProjectService.delete(projectId);
    
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