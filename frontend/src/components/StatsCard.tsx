import { Clock, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { SampleStatus } from '../types';
import { statusLabels } from '../utils/helpers';

interface StatsCardProps {
  status: SampleStatus;
  count: number;
  total: number;
}

export const StatsCard = ({ status, count, total }: StatsCardProps) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  const iconProps = {
    pending_receive: {
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      barColor: 'bg-yellow-500',
    },
    pending_review: {
      icon: Package,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      barColor: 'bg-blue-500',
    },
    abnormal: {
      icon: AlertTriangle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      barColor: 'bg-red-500',
    },
    completed: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      barColor: 'bg-green-500',
    },
  };

  const { icon: Icon, bgColor, textColor, barColor } = iconProps[status];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
        <span className="text-3xl font-bold text-gray-800">{count}</span>
      </div>
      <h3 className="text-gray-700 font-medium mb-2">{statusLabels[status]}</h3>
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-500">{percentage}%</span>
      </div>
    </div>
  );
};
