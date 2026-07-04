import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBatches, receiveBatch } from '../store/batches';
import { BatchCard } from '../components/BatchCard';
import { StatsCard } from '../components/StatsCard';
import { ConflictModal } from '../components/ConflictModal';
import { RootState, AppDispatch } from '../store';
import { Batch, SampleStatus } from '../types';
import { statusLabels } from '../utils/helpers';
import { ClipboardList, Plus, RefreshCw } from 'lucide-react';

export const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: batches, loading } = useSelector((state: RootState) => state.batches);
  const [conflictModal, setConflictModal] = useState({ isOpen: false, message: '' });
  const [currentUser] = useState('operator1');

  useEffect(() => {
    dispatch(fetchBatches());
  }, [dispatch]);

  const stats = {
    pending_receive: batches.filter((b) => b.status === 'pending_receive').length,
    pending_review: batches.filter((b) => b.status === 'pending_review').length,
    abnormal: batches.filter((b) => b.status === 'abnormal').length,
    completed: batches.filter((b) => b.status === 'completed').length,
  };

  const total = batches.length;

  const handleReceive = async (batch: Batch) => {
    try {
      await dispatch(receiveBatch({ id: batch.id, version: batch.version, operator: currentUser })).unwrap();
    } catch (error: any) {
      if (error.error === 'CONFLICT') {
        setConflictModal({ isOpen: true, message: error.message });
      }
    }
  };

  const handleRefresh = () => {
    dispatch(fetchBatches());
    setConflictModal({ isOpen: false, message: '' });
  };

  const statusGroups: SampleStatus[] = ['pending_receive', 'pending_review', 'abnormal', 'completed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ClipboardList className="h-6 w-6 text-lab-dark" />
          <h2 className="text-2xl font-bold text-gray-800">样本批次看板</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => dispatch(fetchBatches())}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>刷新</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-lab-accent text-lab-dark font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>新建批次</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusGroups.map((status) => (
          <StatsCard
            key={status}
            status={status}
            count={stats[status]}
            total={total}
          />
        ))}
      </div>

      {statusGroups.map((status) => {
        const filteredBatches = batches.filter((b) => b.status === status);
        return (
          <div key={status}>
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${status === 'pending_receive' ? 'bg-yellow-500' : status === 'pending_review' ? 'bg-blue-500' : status === 'abnormal' ? 'bg-red-500' : 'bg-green-500'}`} />
              <h3 className="text-lg font-semibold text-gray-800">{statusLabels[status]}</h3>
              <span className="text-sm text-gray-500">({filteredBatches.length})</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 text-lab-accent animate-spin" />
              </div>
            ) : filteredBatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onReceive={handleReceive}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                <p className="text-gray-400">暂无{statusLabels[status]}的批次</p>
              </div>
            )}
          </div>
        );
      })}

      <ConflictModal
        isOpen={conflictModal.isOpen}
        message={conflictModal.message}
        onRefresh={handleRefresh}
      />
    </div>
  );
};
