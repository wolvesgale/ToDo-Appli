import React, { useState } from 'react';
import { Button, Input, Modal, Select } from '@/components/ui';
import { Task } from '@/types/database';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF, 
  ExportFormat, 
  ExportOptions,
  getFilteredTasks
} from '@/lib/export';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projectName: string;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  tasks,
  projectName
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCompleted: true,
    includeArchived: false,
    dateRange: undefined
  });

  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // フィルタリングされたタスク数を計算
  const filteredTasksCount = getFilteredTasks(tasks, {
    ...exportOptions,
    dateRange: dateRange.start && dateRange.end ? dateRange : undefined
  }).length;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        ...exportOptions,
        dateRange: dateRange.start && dateRange.end ? dateRange : undefined
      };

      const filename = `${projectName}_tasks_${new Date().toISOString().split('T')[0]}`;

      switch (exportOptions.format) {
        case 'csv':
          await exportToCSV(tasks, options, filename);
          break;
        case 'excel':
          await exportToExcel(tasks, options, filename);
          break;
        case 'pdf':
          await exportToPDF(tasks, options, filename);
          break;
      }

      onClose();
    } catch (error) {
      console.error('エクスポートエラー:', error);
      alert('エクスポートに失敗しました。');
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
    { value: 'pdf', label: 'PDF' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="タスクをエクスポート"
      size="md"
    >
      <div className="space-y-6">
        {/* エクスポート形式選択 */}
        <div>
          <Select
            label="エクスポート形式"
            value={exportOptions.format}
            onChange={(value) => setExportOptions(prev => ({ ...prev, format: value as ExportFormat }))}
            options={formatOptions}
          />
        </div>

        {/* オプション設定 */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            エクスポートオプション
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeCompleted}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  includeCompleted: e.target.checked 
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                完了済みタスクを含める
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeArchived}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  includeArchived: e.target.checked 
                }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                アーカイブ済みタスクを含める
              </span>
            </label>
          </div>
        </div>

        {/* 日付範囲フィルター */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            日付範囲フィルター（任意）
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="開始日"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <Input
              label="終了日"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        {/* エクスポート対象タスク数表示 */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            エクスポート対象: {filteredTasksCount} 個のタスク
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || filteredTasksCount === 0}
          >
            {isExporting ? 'エクスポート中...' : 'エクスポート'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportDialog;