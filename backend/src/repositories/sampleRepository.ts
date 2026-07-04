import { prisma } from '../utils/prisma';
import { SampleStatus } from '../types';

export const sampleRepository = {
  findByBatchId: async (batchId: string) => {
    return prisma.sample.findMany({
      where: { batchId },
      orderBy: { collectionNo: 'asc' },
    });
  },

  findById: async (id: string) => {
    return prisma.sample.findUnique({ where: { id } });
  },

  create: async (data: {
    collectionNo: string;
    batchId: string;
    preservationCondition: string;
    status: SampleStatus;
    currentResponsible: string;
    abnormalReason?: string | null;
  }) => {
    return prisma.sample.create({ data });
  },

  updateStatus: async (
    id: string,
    status: SampleStatus,
    currentResponsible: string,
    version: number,
    abnormalReason?: string | null
  ) => {
    return prisma.sample.update({
      where: { id, version },
      data: {
        status,
        currentResponsible,
        abnormalReason,
        version: version + 1,
      },
    });
  },

  batchUpdateStatus: async (
    batchId: string,
    status: SampleStatus,
    currentResponsible: string
  ) => {
    return prisma.sample.updateMany({
      where: { batchId },
      data: {
        status,
        currentResponsible,
        version: { increment: 1 },
      },
    });
  },

  deleteByBatchId: async (batchId: string) => {
    return prisma.sample.deleteMany({ where: { batchId } });
  },
};
