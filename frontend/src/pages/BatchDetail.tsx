import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatchById } from '../store/batches';
import { fetchSamples, reviewSample, resolveAbnormal } from '../store/samples';
import { SampleRow } from '../components/SampleRow';
import { ConflictModal } from '../components/ConflictModal';
import { RootState, AppDispatch } from '../store';
import { Sample } from '../types';
import {
  statusLabels,
  formatDateTime,
} from '../utils/helpers';
import { ArrowLeft, Package, Clock, Users, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

export const BatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const batch = useSelector((state: RootState) =>
    state.batches.items.find((b) => b.id === id)
  );
  const { items: samples, loading } = useSelector((state: RootState) => state.samples);

  const [conflictModal, setConflictModal] = useState({ isOpen: false, message: '' });
  const [currentUser] = useState('operator1');

  useEffect(() => {
    if (id) {
      dispatch(fetchBatchById(id));
      dispatch(fetchSamples(id));
    }
  }, [id, dispatch]);

  const handleReview = async (sample: Sample, result: 'pass' | 'abnormal', reason?: string) => {
    try {
      await dispatch(
        reviewSample({
          id: sample.id,
          version: sample.version,
          operator: currentUser,
          result,
          abnormalReason: reason,
        })
      ).unwrap();
    } catch (error: any) {
      if (error.error === 'CONFLICT') {
        setConflictModal({ isOpen: true, message: error.message });
      }
    }
  };

  const handleResolveAbnormal = async (sample: Sample) => {
    try {
      await dispatch(
        resolveAbnormal({
          id: sample.id,
          version: sample.version,
          operator: currentUser,
        })
      ).unwrap();
    } catch (error: any) {
      if (error.error === 'CONFLICT') {
        setConflictModal({ isOpen: true, message: error.message });
      }
    }
  };

  const handleRefresh = () => {
    if (id) {
      dispatch(fetchBatchById(id));
      dispatch(fetchSamples(id));
    }
    setConflictModal({ isOpen: false, message: '' });
  };

  const getStatusColor = () => {
    if (!batch) return '';
    switch (batch.status) {
      case 'pending_receive':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_review':
        return 'bg-blue-100 text-blue-800';
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  const completedCount = samples.filter((s) => s.status === 'completed').length;
  const abnormalCount = samples.filter((s) => s.status === 'abnormal').length;

  if (!batch) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 text-lab-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回看板</span>
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>刷新</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-lab-dark p-3 rounded-xl">
              <Package className="h-8 w-8 text-lab-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">批次 {batch.batchNo}</h1>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {statusLabels[batch.status]}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-600">已完成: {completedCount}/{samples.length}</span>
            </div>
            {abnormalCount > 0 && (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-gray-600">异常: {abnormalCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Package className="h-4 w-4" />
              <span>来源单位</span>
            </div>
            <span className="font-medium text-gray-800">{batch.sourceUnit}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Clock className="h-4 w-4" />
              <span>到达时间</span>
            </div>
            <span className="font-medium text-gray-800">{formatDateTime(batch.arrivalTime)}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              <span>当前责任人</span>
            </div>
            <span className="font-medium text-gray-800">{batch.currentResponsible}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">样本列表</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">采集编号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">保存条件</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">责任人</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">异常说明</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <RefreshCw className="h-6 w-6 text-lab-accent animate-spin mx-auto" />
                  </td>
                </tr>
              ) : samples.length > 0 ? (
                samples.map((sample) => (
                  <SampleRow
                    key={sample.id}
                    sample={sample}
                    onReview={handleReview}
                    onResolveAbnormal={handleResolveAbnormal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    暂无样本数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConflictModal
        isOpen={conflictModal.isOpen}
        message={conflictModal.message}
        onRefresh={handleRefresh}
      />
    </div>
  );
};
