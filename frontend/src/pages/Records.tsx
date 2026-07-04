import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecords } from '../store/records';
import { RootState, AppDispatch } from '../store';
import { RecordAction } from '../types';
import {
  actionLabels,
  formatDateTime,
} from '../utils/helpers';
import { History, Search, Calendar, Filter, RefreshCw, User, Package } from 'lucide-react';

export const Records = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: records, loading } = useSelector((state: RootState) => state.records);

  const [filters, setFilters] = useState({
    batchId: '',
    sampleId: '',
    operator: '',
    action: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  const handleSearch = () => {
    const query: any = {};
    if (filters.batchId) query.batchId = filters.batchId;
    if (filters.sampleId) query.sampleId = filters.sampleId;
    if (filters.operator) query.operator = filters.operator;
    if (filters.action) query.action = filters.action;
    if (filters.startTime) query.startTime = filters.startTime;
    if (filters.endTime) query.endTime = filters.endTime;
    dispatch(fetchRecords(query));
  };

  const handleReset = () => {
    setFilters({
      batchId: '',
      sampleId: '',
      operator: '',
      action: '',
      startTime: '',
      endTime: '',
    });
    dispatch(fetchRecords());
  };

  const getActionColor = (action: RecordAction) => {
    switch (action) {
      case 'receive':
        return 'bg-blue-100 text-blue-800';
      case 'review_pass':
        return 'bg-green-100 text-green-800';
      case 'review_abnormal':
        return 'bg-red-100 text-red-800';
      case 'resolve_abnormal':
        return 'bg-yellow-100 text-yellow-800';
      case 'reject':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <History className="h-6 w-6 text-lab-dark" />
        <h2 className="text-2xl font-bold text-gray-800">流转记录</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-700">筛选条件</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">批次号</label>
            <input
              type="text"
              value={filters.batchId}
              onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
              placeholder="输入批次号"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-lab-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">采集编号</label>
            <input
              type="text"
              value={filters.sampleId}
              onChange={(e) => setFilters({ ...filters, sampleId: e.target.value })}
              placeholder="输入采集编号"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-lab-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">操作人</label>
            <input
              type="text"
              value={filters.operator}
              onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
              placeholder="输入操作人"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-lab-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">操作类型</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-lab-accent"
            >
              <option value="">全部</option>
              <option value="receive">接收</option>
              <option value="review_pass">复核通过</option>
              <option value="review_abnormal">复核异常</option>
              <option value="resolve_abnormal">解除异常</option>
              <option value="reject">退回</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">开始时间</label>
            <input
              type="datetime-local"
              value={filters.startTime}
              onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-lab-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">结束时间</label>
            <input
              type="datetime-local"
              value={filters.endTime}
              onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-lab-accent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-4 py-2 bg-lab-accent text-lab-dark font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>搜索</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>重置</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">记录列表</h3>
          <p className="text-sm text-gray-500 mt-1">共 {records.length} 条记录</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">批次号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">采集编号</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作人</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作类型</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作时间</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">备注</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <RefreshCw className="h-6 w-6 text-lab-accent animate-spin mx-auto" />
                  </td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{record.batchNo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{record.sampleCollectionNo}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{record.operator}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(record.action)}`}>
                        {actionLabels[record.action]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{formatDateTime(record.actionTime)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {record.remark || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    暂无记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
