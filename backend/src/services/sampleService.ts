import { sampleRepository } from '../repositories/sampleRepository';
import { recordRepository } from '../repositories/recordRepository';
import { batchRepository } from '../repositories/batchRepository';
import { SampleStatus, RecordAction } from '../types';

export const sampleService = {
  getSamplesByBatchId: async (batchId: string) => {
    return sampleRepository.findByBatchId(batchId);
  },

  reviewSample: async (
    sampleId: string,
    version: number,
    operator: string,
    result: 'pass' | 'abnormal',
    abnormalReason?: string
  ) => {
    const sample = await sampleRepository.findById(sampleId);
    if (!sample) {
      throw new Error('样本不存在');
    }

    if (sample.version !== version) {
      throw new Error(`CONFLICT:当前版本 ${sample.version}`);
    }

    if (sample.status !== 'pending_review') {
      throw new Error('样本状态不允许复核');
    }

    if (result === 'abnormal' && !abnormalReason) {
      throw new Error('异常样本必须填写异常原因');
    }

    const newStatus: SampleStatus =
      result === 'pass' ? 'completed' : 'abnormal';

    const updatedSample = await sampleRepository.updateStatus(
      sampleId,
      newStatus,
      operator,
      version,
      abnormalReason || null
    );

    const action: RecordAction =
      result === 'pass' ? 'review_pass' : 'review_abnormal';

    await recordRepository.create({
      sampleId,
      batchId: sample.batchId,
      operator,
      action,
      remark: abnormalReason || '复核通过',
    });

    await checkBatchCompletion(sample.batchId);

    return updatedSample;
  },

  resolveAbnormal: async (
    sampleId: string,
    version: number,
    operator: string
  ) => {
    const sample = await sampleRepository.findById(sampleId);
    if (!sample) {
      throw new Error('样本不存在');
    }

    if (sample.version !== version) {
      throw new Error(`CONFLICT:当前版本 ${sample.version}`);
    }

    if (sample.status !== 'abnormal') {
      throw new Error('样本状态不是异常');
    }

    const updatedSample = await sampleRepository.updateStatus(
      sampleId,
      'pending_review',
      operator,
      version,
      null
    );

    await recordRepository.create({
      sampleId,
      batchId: sample.batchId,
      operator,
      action: 'resolve_abnormal',
      remark: '异常已解除',
    });

    await checkBatchCompletion(sample.batchId);

    return updatedSample;
  },
};

async function checkBatchCompletion(batchId: string) {
  const samples = await sampleRepository.findByBatchId(batchId);
  const batch = await batchRepository.findById(batchId);
  if (!batch) return;

  const allCompleted = samples.every((s) => s.status === 'completed');
  const allReviewed = samples.every(
    (s) => s.status === 'completed' || s.status === 'abnormal'
  );

  if (allCompleted && batch.status !== 'completed') {
    await batchRepository.updateStatus(
      batchId,
      'completed',
      batch.currentResponsible,
      batch.version
    );
  } else if (
    allReviewed &&
    batch.status === 'pending_receive' &&
    !allCompleted
  ) {
    await batchRepository.updateStatus(
      batchId,
      'pending_review',
      batch.currentResponsible,
      batch.version
    );
  }
}
