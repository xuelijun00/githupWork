export type SampleStatus = 'pending_receive' | 'pending_review' | 'abnormal' | 'completed';

export type RecordAction = 'receive' | 'review_pass' | 'review_abnormal' | 'resolve_abnormal' | 'reject';

export interface Batch {
  id: string;
  batchNo: string;
  sourceUnit: string;
  arrivalTime: string;
  status: SampleStatus;
  sampleCount: number;
  currentResponsible: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sample {
  id: string;
  collectionNo: string;
  preservationCondition: string;
  status: SampleStatus;
  currentResponsible: string;
  abnormalReason: string | null;
  version: number;
  batchId: string;
}

export interface Record {
  id: string;
  sampleId: string;
  sampleCollectionNo: string;
  batchId: string;
  batchNo: string;
  operator: string;
  action: RecordAction;
  actionTime: string;
  remark: string | null;
}

export interface CreateBatchRequest {
  batchNo: string;
  sourceUnit: string;
  samples: {
    collectionNo: string;
    preservationCondition: string;
  }[];
}

export interface ReceiveBatchRequest {
  version: number;
  operator: string;
}

export interface ReviewSampleRequest {
  version: number;
  operator: string;
  result: 'pass' | 'abnormal';
  abnormalReason?: string;
}

export interface ResolveAbnormalRequest {
  version: number;
  operator: string;
}

export interface ConflictResponse {
  error: 'CONFLICT';
  message: string;
  currentVersion: number;
}

export interface GetRecordsQuery {
  sampleId?: string;
  batchId?: string;
  operator?: string;
  action?: RecordAction;
  startTime?: string;
  endTime?: string;
}
