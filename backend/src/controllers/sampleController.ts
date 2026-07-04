import { Request, Response } from 'express';
import { sampleService } from '../services/sampleService';

export const sampleController = {
  getSamplesByBatchId: async (req: Request, res: Response) => {
    try {
      const { batchId } = req.params;
      const samples = await sampleService.getSamplesByBatchId(batchId);
      res.json(samples);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  reviewSample: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { version, operator, result, abnormalReason } = req.body;
      const sample = await sampleService.reviewSample(
        id,
        version,
        operator,
        result,
        abnormalReason
      );
      res.json(sample);
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith('CONFLICT')) {
        const currentVersion = parseInt(message.split(' ')[1]);
        return res.status(409).json({
          error: 'CONFLICT',
          message: '该样本已被其他用户修改，请刷新后重新操作',
          currentVersion,
        });
      }
      res.status(400).json({ error: message });
    }
  },

  resolveAbnormal: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { version, operator } = req.body;
      const sample = await sampleService.resolveAbnormal(id, version, operator);
      res.json(sample);
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith('CONFLICT')) {
        const currentVersion = parseInt(message.split(' ')[1]);
        return res.status(409).json({
          error: 'CONFLICT',
          message: '该样本已被其他用户修改，请刷新后重新操作',
          currentVersion,
        });
      }
      res.status(400).json({ error: message });
    }
  },
};
