import { useNavigate } from 'react-router-dom';
import { Package, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Batch } from '../types';
import {
  statusLabels,
  statusColors,
  statusBgColors,
  formatDateTime,
} from '../utils/helpers';

interface BatchCardProps {
  batch: Batch;
  onReceive?: (batch: Batch) => void;
}

export const BatchCard = ({ batch, onReceive }: BatchCardProps) => {
  const navigate = useNavigate();
  const canReceive = batch.status === 'pending_receive';

  const statusIcon = {
    pending_receive: Clock,
    pending_review: Package,
    abnormal: AlertCircle,
    completed: CheckCircle,
  };

  const StatusIcon = statusIcon[batch.status];

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${statusBgColors[batch.status]}`}
      onClick={() => navigate(`/batch/${batch.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${statusColors[batch.status].split(' ')[1]}`} />
          <span className="font-semibold text-gray-800">批次 {batch.batchNo}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[batch.status]}`}>
          {statusLabels[batch.status]}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4" />
          <span>来源单位: {batch.sourceUnit}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>到达时间: {formatDateTime(batch.arrivalTime)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>样本数量: {batch.sampleCount}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">责任人: {batch.currentResponsible}</span>
        </div>
      </div>

      {canReceive && onReceive && (
        <button
          className="mt-4 w-full bg-lab-accent hover:bg-opacity-90 text-lab-dark font-semibold py-2 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onReceive(batch);
          }}
        >
          批量接收
        </button>
      )}
    </div>
  );
};
