import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { Task, Project } from '@/types/database';

// エクスポート形式の型定義
export type ExportFormat = 'csv' | 'excel' | 'pdf';

// エクスポートオプションの型定義
export interface ExportOptions {
  format: ExportFormat;
  includeCompleted: boolean;
  includeArchived: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// エクスポート用のタスクデータ型
export interface ExportTaskData {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt: string;
  tags: string;
}

// タスクのステータスラベルを取得
export const getStatusLabel = (status: Task['status']): string => {
  switch (status) {
    case 'done':
      return '完了';
    case 'in_progress':
      return '進行中';
    case 'todo':
      return '未着手';
    case 'archived':
      return 'アーカイブ';
    default:
      return status;
  }
};

// 優先度ラベルを取得
export const getPriorityLabel = (priority: Task['priority']): string => {
  switch (priority) {
    case 'urgent':
      return '緊急';
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return priority;
  }
};

// 日付文字列を取得（空の場合は'-'を返す）
export const getDateString = (date?: string): string => {
  return date ? new Date(date).toLocaleDateString('ja-JP') : '-';
};

// タスクをエクスポート用データに変換
export const convertTaskToExportData = (task: Task): ExportTaskData => {
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description || '',
    status: getStatusLabel(task.status),
    priority: getPriorityLabel(task.priority),
    assignee: task.assigneeId || '-',
    createdBy: task.createdBy,
    createdAt: getDateString(task.createdAt),
    updatedAt: getDateString(task.updatedAt),
    dueDate: getDateString(task.dueDate),
    completedAt: getDateString(task.completedAt),
    tags: task.tags.join(', ')
  };
};

// フィルタリングされたタスクを取得
export const getFilteredTasks = (tasks: Task[], options: ExportOptions): Task[] => {
  let filteredTasks = [...tasks];

  // 完了済みタスクのフィルタリング
  if (!options.includeCompleted) {
    filteredTasks = filteredTasks.filter(task => task.status !== 'done');
  }

  // アーカイブ済みタスクのフィルタリング
  if (!options.includeArchived) {
    filteredTasks = filteredTasks.filter(task => task.status !== 'archived');
  }

  // 日付範囲でのフィルタリング
  if (options.dateRange) {
    const startDate = new Date(options.dateRange.start);
    const endDate = new Date(options.dateRange.end);
    
    filteredTasks = filteredTasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate <= endDate;
    });
  }

  return filteredTasks;
};

// CSVエクスポート
export const exportToCSV = async (tasks: Task[], options: ExportOptions, filename: string = 'tasks'): Promise<void> => {
  const filteredTasks = getFilteredTasks(tasks, options);
  const exportData = filteredTasks.map(convertTaskToExportData);

  const csv = Papa.unparse(exportData, {
    header: true,
    columns: [
      'id', 'projectId', 'title', 'description', 'status', 'priority',
      'assignee', 'createdBy', 'createdAt', 'updatedAt', 'dueDate', 'completedAt', 'tags'
    ]
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Excelエクスポート
export const exportToExcel = async (tasks: Task[], options: ExportOptions, filename: string = 'tasks'): Promise<void> => {
  const filteredTasks = getFilteredTasks(tasks, options);
  const exportData = filteredTasks.map(convertTaskToExportData);

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// PDFエクスポート
export const exportToPDF = async (tasks: Task[], options: ExportOptions, filename: string = 'tasks'): Promise<void> => {
  const filteredTasks = getFilteredTasks(tasks, options);
  const exportData = filteredTasks.map(convertTaskToExportData);

  // HTMLテーブルを作成
  const tableHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>タスク一覧</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">タイトル</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">ステータス</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">優先度</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">担当者</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">期限</th>
          </tr>
        </thead>
        <tbody>
          ${exportData.map(task => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${task.title}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${task.status}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${task.priority}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${task.assignee}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${task.dueDate}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // 一時的なDIV要素を作成
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = tableHTML;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '800px';
  
  document.body.appendChild(tempDiv);

  try {
    // HTML2Canvasでキャンバスに変換
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    // PDFを作成
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const imgWidth = 210; // A4幅
    const pageHeight = 295; // A4高さ
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 最初のページ
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 複数ページに分割
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } finally {
    // 一時的な要素を削除
    document.body.removeChild(tempDiv);
  }
};