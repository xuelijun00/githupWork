import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Sample } from '../types';
import {
  statusLabels,
  statusColors,
} from '../utils/helpers';

interface SampleRowProps {
  sample: Sample;
  onReview: (sample: Sample, result: 'pass' | 'abnormal', reason?: string) => void;
  onResolveAbnormal: (sample: Sample) => void;
}

export const SampleRow = ({ sample, onReview, onResolveAbnormal }: SampleRowProps) => {
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [abnormalReason, setAbnormalReason] = useState('');

  const handleAbnormalClick = () => {
    setShowReasonInput(true);
  };

  const handleSubmitAbnormal = () => {
    if (abnormalReason.trim()) {
      onReview(sample, 'abnormal', abnormalReason.trim());
      setShowReasonInput(false);
      setAbnormalReason('');
    }
  };

  const handlePassClick = () => {
    onReview(sample, 'pass');
  };

  const renderActions = () => {
    switch (sample.status) {
      case 'pending_review':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePassClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
            >
              <CheckCircle className="h-4 w-4" />
              <span>通过</span>
            </button>
            <button
              onClick={handleAbnormalClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              <XCircle className="h-4 w-4" />
              <span>异常</span>
            </button>
          </div>
        );
      case 'abnormal':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onResolveAbnormal(sample)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-lab-accent hover:bg-opacity-90 text-lab-dark rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>解除异常</span>
            </button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">已完成</span>
          </div>
        );
      case 'pending_receive':
        return (
          <div className="text-gray-400 text-sm">等待接收</div>
        );
      default:
        return null;
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <span className="font-medium text-gray-800">{sample.collectionNo}</span>
      </td>
      <td className="px-4 py-3 text-gray-600">{sample.preservationCondition}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[sample.status]}`}>
          {statusLabels[sample.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600">{sample.currentResponsible}</td>
      <td className="px-4 py-3">
        {sample.abnormalReason ? (
          <div className="flex items-center space-x-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{sample.abnormalReason}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        {renderActions()}
        {showReasonInput && (
          <div className="mt-2 p-3 bg-red-50 rounded-lg">
            <textarea
              value={abnormalReason}
              onChange={(e) => setAbnormalReason(e.target.value)}
              placeholder="请填写异常原因..."
              className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-400 text-sm"
              rows={2}
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleSubmitAbnormal}
                disabled={!abnormalReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-1.5 rounded-lg text-sm"
              >
                提交
              </button>
              <button
                onClick={() => setShowReasonInput(false)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};
