import { NextRequest, NextResponse } from 'next/server';
import { MockUserService } from '@/lib/mock-dynamodb';

// ユーザー一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');

    let users;
    if (search) {
      // 名前で検索
      users = await MockUserService.searchByName(search, limit);
    } else {
      // 全ユーザー取得
      users = await MockUserService.getAll();
    }

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザー一覧の取得に失敗しました'
      },
      { status: 500 }
    );
  }
}

// ユーザー作成
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    const user = await MockUserService.create(userData);

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'ユーザーの作成に失敗しました'
      },
      { status: 500 }
    );
  }
}