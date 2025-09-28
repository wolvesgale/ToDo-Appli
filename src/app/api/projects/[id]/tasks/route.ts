import { NextRequest, NextResponse } from 'next/server';
import { TaskService, withErrorHandling } from '@/lib/database';

// タスク一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    
    // プロジェクトのタスクを取得
    const tasks = await TaskService.getByProjectId(projectId);
    
    return NextResponse.json({ success: true, data: tasks });
  });
}

// タスク追加
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    const body = await request.json();
    
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
  });
}

// タスク更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    const body = await request.json();
    
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
    
    return NextResponse.json({ success: true, data: updatedTask });
  });
}

// タスク削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandling(async () => {
    const projectId = params.id;
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_TASK_ID', message: 'Task ID is required' } },
        { status: 400 }
      );
    }
    
    await TaskService.delete(projectId, taskId);
    
    return NextResponse.json({ success: true, data: { deleted: true } });
  });
}