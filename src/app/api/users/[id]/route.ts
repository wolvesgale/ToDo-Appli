import { NextRequest, NextResponse } from 'next/server';
import { MockUserService } from '@/lib/mock-dynamodb';

// 個別ユーザー取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const user = await MockUserService.getById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'ユーザーが見つかりません'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザーの取得に失敗しました'
      },
      { status: 500 }
    );
  }
}

// ユーザー更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const updates = await request.json();
    
    const user = await MockUserService.update(userId, updates);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'ユーザーが見つかりません'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('ユーザー更新エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザーの更新に失敗しました'
      },
      { status: 500 }
    );
  }
}

// ユーザー削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const success = await MockUserService.delete(userId);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'ユーザーが見つかりません'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ユーザーが削除されました'
    });
  } catch (error) {
    console.error('ユーザー削除エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザーの削除に失敗しました'
      },
      { status: 500 }
    );
  }
}