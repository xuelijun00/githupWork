import {
  Batch,
  Sample,
  Record,
  CreateBatchRequest,
  ReceiveBatchRequest,
  ReviewSampleRequest,
  ResolveAbnormalRequest,
  GetRecordsQuery,
  SampleStatus,
} from '../types';

const API_BASE = '/api';

export const api = {
  batches: {
    getAll: async (status?: SampleStatus): Promise<Batch[]> => {
      const params = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE}/batches${params}`);
      return response.json();
    },

    getById: async (id: string): Promise<Batch> => {
      const response = await fetch(`${API_BASE}/batches/${id}`);
      return response.json();
    },

    create: async (data: CreateBatchRequest): Promise<Batch> => {
      const response = await fetch(`${API_BASE}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    receive: async (id: string, data: ReceiveBatchRequest): Promise<Batch> => {
      const response = await fetch(`${API_BASE}/batches/${id}/receive`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 409) {
        throw await response.json();
      }
      return response.json();
    },
  },

  samples: {
    getByBatchId: async (batchId: string): Promise<Sample[]> => {
      const response = await fetch(`${API_BASE}/samples/batch/${batchId}`);
      return response.json();
    },

    review: async (id: string, data: ReviewSampleRequest): Promise<Sample> => {
      const response = await fetch(`${API_BASE}/samples/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 409) {
        throw await response.json();
      }
      return response.json();
    },

    resolveAbnormal: async (
      id: string,
      data: ResolveAbnormalRequest
    ): Promise<Sample> => {
      const response = await fetch(`${API_BASE}/samples/${id}/resolve-abnormal`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.status === 409) {
        throw await response.json();
      }
      return response.json();
    },
  },

  records: {
    getAll: async (query?: GetRecordsQuery): Promise<Record[]> => {
      const params = new URLSearchParams(query as any).toString();
      const url = params ? `${API_BASE}/records?${params}` : `${API_BASE}/records`;
      const response = await fetch(url);
      return response.json();
    },
  },
};
