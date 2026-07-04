import { prisma } from '../utils/prisma';
import { RecordAction } from '../types';

export const recordRepository = {
  findAll: async (query: {
    sampleId?: string;
    batchId?: string;
    operator?: string;
    action?: RecordAction;
    startTime?: string;
    endTime?: string;
  }) => {
    const where: any = {};
    if (query.sampleId) where.sampleId = query.sampleId;
    if (query.batchId) where.batchId = query.batchId;
    if (query.operator) where.operator = query.operator;
    if (query.action) where.action = query.action;
    if (query.startTime)
      where.actionTime = { ...where.actionTime, gte: new Date(query.startTime) };
    if (query.endTime)
      where.actionTime = { ...where.actionTime, lte: new Date(query.endTime) };

    return prisma.record.findMany({
      where,
      orderBy: { actionTime: 'desc' },
      include: {
        sample: { select: { collectionNo: true } },
        batch: { select: { batchNo: true } },
      },
    });
  },

  create: async (data: {
    sampleId: string;
    batchId: string;
    operator: string;
    action: RecordAction;
    remark?: string | null;
  }) => {
    return prisma.record.create({ data });
  },

  batchCreate: async (
    records: Array<{
      sampleId: string;
      batchId: string;
      operator: string;
      action: RecordAction;
      remark?: string | null;
    }>
  ) => {
    return prisma.record.createMany({ data: records });
  },
};
