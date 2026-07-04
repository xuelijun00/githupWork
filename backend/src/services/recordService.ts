import { recordRepository } from '../repositories/recordRepository';
import { RecordAction } from '../types';

export const recordService = {
  getRecords: async (query: {
    sampleId?: string;
    batchId?: string;
    operator?: string;
    action?: RecordAction;
    startTime?: string;
    endTime?: string;
  }) => {
    const records = await recordRepository.findAll(query);
    return records.map((record) => ({
      id: record.id,
      sampleId: record.sampleId,
      sampleCollectionNo: record.sample?.collectionNo || '',
      batchId: record.batchId,
      batchNo: record.batch?.batchNo || '',
      operator: record.operator,
      action: record.action,
      actionTime: record.actionTime.toISOString(),
      remark: record.remark,
    }));
  },
};
