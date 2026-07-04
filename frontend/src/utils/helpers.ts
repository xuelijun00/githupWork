import { SampleStatus, RecordAction } from '../types';

export const statusLabels: Record<SampleStatus, string> = {
  pending_receive: '待接收',
  pending_review: '待复核',
  abnormal: '异常待处理',
  completed: '已完成',
};

export const statusColors: Record<SampleStatus, string> = {
  pending_receive: 'bg-yellow-100 text-yellow-800',
  pending_review: 'bg-blue-100 text-blue-800',
  abnormal: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
};

export const statusBgColors: Record<SampleStatus, string> = {
  pending_receive: 'bg-yellow-50 border-yellow-200',
  pending_review: 'bg-blue-50 border-blue-200',
  abnormal: 'bg-red-50 border-red-200',
  completed: 'bg-green-50 border-green-200',
};

export const actionLabels: Record<RecordAction, string> = {
  receive: '接收',
  review_pass: '复核通过',
  review_abnormal: '复核异常',
  resolve_abnormal: '解除异常',
  reject: '退回',
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusGroup = (status: SampleStatus): SampleStatus[] => {
  switch (status) {
    case 'pending_receive':
      return ['pending_receive'];
    case 'pending_review':
      return ['pending_review'];
    case 'abnormal':
      return ['abnormal'];
    case 'completed':
      return ['completed'];
    default:
      return ['pending_receive', 'pending_review', 'abnormal', 'completed'];
  }
};

export const users = ['operator1', 'operator2', 'admin'];
