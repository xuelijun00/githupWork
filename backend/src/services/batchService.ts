import { batchRepository } from '../repositories/batchRepository';
import { sampleRepository } from '../repositories/sampleRepository';
import { recordRepository } from '../repositories/recordRepository';
import { SampleStatus, RecordAction } from '../types';

export const batchService = {
  getAllBatches: async (status?: SampleStatus) => {
    return batchRepository.findAll(status);
  },

  getBatchById: async (id: string) => {
    return batchRepository.findById(id);
  },

  createBatch: async (data: {
    batchNo: string;
    sourceUnit: string;
    samples: { collectionNo: string; preservationCondition: string }[];
  }) => {
    const existing = await batchRepository.findByBatchNo(data.batchNo);
    if (existing) {
      throw new Error('批次编号已存在');
    }

    const batch = await batchRepository.create({
      batchNo: data.batchNo,
      sourceUnit: data.sourceUnit,
      arrivalTime: new Date(),
      status: 'pending_receive',
      sampleCount: data.samples.length,
      currentResponsible: 'system',
    });

    for (const sampleData of data.samples) {
      await sampleRepository.create({
        collectionNo: sampleData.collectionNo,
        batchId: batch.id,
        preservationCondition: sampleData.preservationCondition,
        status: 'pending_receive',
        currentResponsible: 'system',
      });
    }

    return batch;
  },

  receiveBatch: async (batchId: string, version: number, operator: string) => {
    const batch = await batchRepository.findById(batchId);
    if (!batch) {
      throw new Error('批次不存在');
    }

    if (batch.version !== version) {
      throw new Error(`CONFLICT:当前版本 ${batch.version}`);
    }

    if (batch.status !== 'pending_receive') {
      throw new Error('批次状态不允许接收');
    }

    await sampleRepository.batchUpdateStatus(
      batchId,
      'pending_review',
      operator
    );

    const updatedBatch = await batchRepository.updateStatus(
      batchId,
      'pending_review',
      operator,
      version
    );

    const samples = await sampleRepository.findByBatchId(batchId);
    const records = samples.map((sample) => ({
      sampleId: sample.id,
      batchId,
      operator,
      action: 'receive' as RecordAction,
      remark: '批量接收',
    }));
    await recordRepository.batchCreate(records);

    return updatedBatch;
  },
};
