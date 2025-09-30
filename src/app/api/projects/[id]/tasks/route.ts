import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/database';

// サービスを動的に取得する関数
async function getTaskService() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasAWSCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

  try {
    // Vercelでは常にモックサービスを使用（AWS設定が複雑なため）
    if (isDevelopment || process.env.VERCEL) {
      // 開発環境またはVercelではモックサービスを使用
      const { MockTaskService } = await import('@/lib/mock-dynamodb');
      return MockTaskService;
    } else if (hasAWSCredentials) {
      // 本番環境で認証情報がある場合は実際のDynamoDBサービスを使用
      const { TaskService: RealTaskService } = await import('@/lib/database');
      return RealTaskService;
    } else {
      // フォールバック：モックサービスを使用
      const { MockTaskService } = await import('@/lib/mock-dynamodb');
      return MockTaskService;
    }
  } catch (error) {
    console.error('Error loading task service:', error);
    // フォールバックとしてモックサービスを使用
    try {
      const { MockTaskService } = await import('@/lib/mock-dynamodb');
      return MockTaskService;
    } catch (fallbackError) {
      console.error('Error loading fallback service:', fallbackError);
      throw new Error('Failed to load any task service');
    }
  }
}

// タスク一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = (await params).id;
    const TaskService = await getTaskService();
    
    // プロジェクトのタスクを取得
    const tasks = await TaskService.getByProjectId(projectId);
    
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// タスク追加
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = (await params).id;
    const body = await request.json();
    const TaskService = await getTaskService();
    
    const taskData = {
      projectId,
      title: body.title,
      description: body.description || '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      assigneeId: body.assigneeId,
      dueDate: body.dueDate,
      tags: body.tags || [],
      matrix: body.matrix || { importance: 'high', urgency: 'high' },
      createdBy: body.createdBy || 'system'
    };
    
    const task = await TaskService.create(taskData);
    
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// タスク更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = (await params).id;
    const body = await request.json();
    const TaskService = await getTaskService();
    
    const updates = {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assigneeId: body.assigneeId,
      dueDate: body.dueDate,
      tags: body.tags,
      matrix: body.matrix
    };
    
    const updatedTask = await TaskService.update(projectId, body.id, updates);
    
    if (!updatedTask) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// タスク部分更新（ステータス更新など）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = (await params).id;
    const body = await request.json();
    const TaskService = await getTaskService();
    
    // PATCHでは送信されたフィールドのみ更新
    const updates: any = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.assigneeId !== undefined) updates.assigneeId = body.assigneeId;
    if (body.dueDate !== undefined) updates.dueDate = body.dueDate;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.matrix !== undefined) updates.matrix = body.matrix;
    
    const updatedTask = await TaskService.update(projectId, body.id, updates);
    
    if (!updatedTask) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    console.error('Error patching task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to patch task' },
      { status: 500 }
    );
  }
}

// タスク削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = (await params).id;
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const TaskService = await getTaskService();
    
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_TASK_ID', message: 'Task ID is required' } },
        { status: 400 }
      );
    }
    
    await TaskService.delete(projectId, taskId);
    
    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}