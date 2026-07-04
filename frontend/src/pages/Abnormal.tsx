import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatches } from '../store/batches';
import { fetchSamples, resolveAbnormal } from '../store/samples';
import { RootState, AppDispatch } from '../store';
import { Sample } from '../types';
import {
  statusLabels,
  formatDateTime,
} from '../utils/helpers';
import { AlertTriangle, RefreshCw, ArrowRight, Clock, Users, Package } from 'lucide-react';

export const Abnormal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items: batches } = useSelector((state: RootState) => state.batches);
  const { items: samples, loading } = useSelector((state: RootState) => state.samples);
  const [currentUser] = useState('operator1');

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  const abnormalBatches = batches.filter((b) => b.status === 'abnormal');

  useEffect(() => {
    if (abnormalBatches.length > 0) {
      const batchIds = abnormalBatches.map((b) => b.id);
      dispatch(fetchSamples(batchIds[0]));
    }
  }, [abnormalBatches, dispatch]);

  const abnormalSamples = samples.filter((s) => s.status === 'abnormal');

  const handleResolveAbnormal = async (sample: Sample) => {
    try {
      await dispatch(
        resolveAbnormal({
          id: sample.id,
          version: sample.version,
          operator: currentUser,
        })
      ).unwrap();
      if (abnormalBatches.length > 0) {
        dispatch(fetchSamples(abnormalBatches[0].id));
      }
    } catch (error: any) {
      console.error('解除异常失败:', error);
    }
  };

  const handleViewBatch = (batchId: string) => {
    navigate(`/batch/${batchId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-800">异常样本处理</h2>
        <button
          onClick={() => dispatch(fetchBatches())}
          className="ml-auto flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>刷新</span>
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">异常样本提醒</h3>
            <p className="text-red-600">当前共有 {abnormalSamples.length} 个异常样本等待处理</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-700 mb-4">异常批次</h3>
            <div className="space-y-2">
              {abnormalBatches.length > 0 ? (
                abnormalBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => dispatch(fetchSamples(batch.id))}
                  >
                    <div className="font-medium text-gray-800">{batch.batchNo}</div>
                    <div className="text-sm text-gray-500">{batch.sourceUnit}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">暂无异常批次</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">异常样本列表</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">采集编号</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">批次号</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">保存条件</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">责任人</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">异常原因</th>
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
                  ) : abnormalSamples.length > 0 ? (
                    abnormalSamples.map((sample) => {
                      const batch = batches.find((b) => b.id === sample.batchId);
                      return (
                        <tr key={sample.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{sample.collectionNo}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleViewBatch(sample.batchId)}
                              className="flex items-center space-x-1 text-lab-accent hover:text-lab-dark"
                            >
                              <Package className="h-4 w-4" />
                              <span>{batch?.batchNo}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{sample.preservationCondition}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">{sample.currentResponsible}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1 text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm">{sample.abnormalReason}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleResolveAbnormal(sample)}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-lab-accent hover:bg-opacity-90 text-lab-dark rounded-lg transition-colors text-sm"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>解除异常</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        <div className="flex flex-col items-center">
                          <Clock className="h-12 w-12 text-gray-300 mb-2" />
                          <p>暂无异常样本</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
