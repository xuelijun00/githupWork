import { prisma } from './prisma';

const users = ['operator1', 'operator2', 'admin'];

interface SampleData {
  collectionNo: string;
  preservationCondition: string;
  abnormalReason?: string;
}

interface BatchData {
  batchNo: string;
  sourceUnit: string;
  arrivalTime: Date;
  status: string;
  samples: SampleData[];
}

const batches: BatchData[] = [
  {
    batchNo: 'B20240704001',
    sourceUnit: '第一医院',
    arrivalTime: new Date('2024-07-04T08:30:00'),
    status: 'pending_receive',
    samples: [
      { collectionNo: 'S001', preservationCondition: '2-8°C' },
      { collectionNo: 'S002', preservationCondition: '2-8°C' },
      { collectionNo: 'S003', preservationCondition: '-20°C' },
    ],
  },
  {
    batchNo: 'B20240704002',
    sourceUnit: '第二医院',
    arrivalTime: new Date('2024-07-04T09:15:00'),
    status: 'pending_review',
    samples: [
      { collectionNo: 'S004', preservationCondition: '2-8°C' },
      { collectionNo: 'S005', preservationCondition: '常温' },
      { collectionNo: 'S006', preservationCondition: '2-8°C' },
      { collectionNo: 'S007', preservationCondition: '-20°C' },
    ],
  },
  {
    batchNo: 'B20240703001',
    sourceUnit: '第三医院',
    arrivalTime: new Date('2024-07-03T14:00:00'),
    status: 'abnormal',
    samples: [
      { collectionNo: 'S008', preservationCondition: '2-8°C', abnormalReason: '样本管破损' },
      { collectionNo: 'S009', preservationCondition: '-20°C', abnormalReason: '标签模糊' },
    ],
  },
  {
    batchNo: 'B20240702001',
    sourceUnit: '第四医院',
    arrivalTime: new Date('2024-07-02T10:00:00'),
    status: 'completed',
    samples: [
      { collectionNo: 'S010', preservationCondition: '2-8°C' },
      { collectionNo: 'S011', preservationCondition: '常温' },
      { collectionNo: 'S012', preservationCondition: '2-8°C' },
    ],
  },
];

async function seed() {
  for (const batchData of batches) {
    const existingBatch = await prisma.batch.findUnique({
      where: { batchNo: batchData.batchNo },
    });

    if (!existingBatch) {
      const batch = await prisma.batch.create({
        data: {
          batchNo: batchData.batchNo,
          sourceUnit: batchData.sourceUnit,
          arrivalTime: batchData.arrivalTime,
          status: batchData.status,
          sampleCount: batchData.samples.length,
          currentResponsible: users[0],
          samples: {
            create: batchData.samples.map((s) => ({
              collectionNo: s.collectionNo,
              preservationCondition: s.preservationCondition,
              status: batchData.status,
              currentResponsible: users[0],
              abnormalReason: s.abnormalReason || null,
            })),
          },
        },
      });

      const samples = await prisma.sample.findMany({
        where: { batchId: batch.id },
      });

      if (batch.status === 'pending_review') {
        for (const sample of samples) {
          await prisma.record.create({
            data: {
              sampleId: sample.id,
              batchId: batch.id,
              operator: users[0],
              action: 'receive',
              actionTime: new Date(),
              remark: '批量接收',
            },
          });
        }
      }

      if (batch.status === 'completed') {
        for (const sample of samples) {
          await prisma.record.create({
            data: {
              sampleId: sample.id,
              batchId: batch.id,
              operator: users[0],
              action: 'receive',
              actionTime: new Date(),
              remark: '批量接收',
            },
          });
          await prisma.record.create({
            data: {
              sampleId: sample.id,
              batchId: batch.id,
              operator: users[1],
              action: 'review_pass',
              actionTime: new Date(),
              remark: '复核通过',
            },
          });
        }
      }

      if (batch.status === 'abnormal') {
        for (const sample of samples) {
          await prisma.record.create({
            data: {
              sampleId: sample.id,
              batchId: batch.id,
              operator: users[0],
              action: 'receive',
              actionTime: new Date(),
              remark: '批量接收',
            },
          });
          await prisma.record.create({
            data: {
              sampleId: sample.id,
              batchId: batch.id,
              operator: users[1],
              action: 'review_abnormal',
              actionTime: new Date(),
              remark: sample.abnormalReason,
            },
          });
        }
      }

      console.log(`Created batch: ${batch.batchNo}`);
    }
  }

  console.log('Seed completed');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
