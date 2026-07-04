import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ConflictModalProps {
  isOpen: boolean;
  message: string;
  onRefresh: () => void;
}

export const ConflictModal = ({ isOpen, message, onRefresh }: ConflictModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-bounce-in">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          数据冲突
        </h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-center space-x-2 bg-lab-accent hover:bg-opacity-90 text-lab-dark font-semibold py-3 rounded-lg transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
          <span>刷新最新状态</span>
        </button>
      </div>
    </div>
  );
};
