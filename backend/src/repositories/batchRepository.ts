import { prisma } from '../utils/prisma';
import { SampleStatus } from '../types';

export const batchRepository = {
  findAll: async (status?: SampleStatus) => {
    const where = status ? { status } : {};
    return prisma.batch.findMany({
      where,
      orderBy: { arrivalTime: 'desc' },
    });
  },

  findById: async (id: string) => {
    return prisma.batch.findUnique({
      where: { id },
      include: { samples: true },
    });
  },

  findByBatchNo: async (batchNo: string) => {
    return prisma.batch.findUnique({
      where: { batchNo },
    });
  },

  create: async (data: {
    batchNo: string;
    sourceUnit: string;
    arrivalTime: Date;
    status: SampleStatus;
    sampleCount: number;
    currentResponsible: string;
  }) => {
    return prisma.batch.create({ data });
  },

  updateStatus: async (
    id: string,
    status: SampleStatus,
    currentResponsible: string,
    version: number
  ) => {
    return prisma.batch.update({
      where: { id, version },
      data: {
        status,
        currentResponsible,
        version: version + 1,
        updatedAt: new Date(),
      },
    });
  },

  updateVersion: async (id: string) => {
    return prisma.batch.update({
      where: { id },
      data: { version: { increment: 1 } },
    });
  },

  delete: async (id: string) => {
    return prisma.batch.delete({ where: { id } });
  },
};
