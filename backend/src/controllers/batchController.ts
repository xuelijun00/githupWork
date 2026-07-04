import { Request, Response } from 'express';
import { batchService } from '../services/batchService';
import { SampleStatus } from '../types';

export const batchController = {
  getAllBatches: async (req: Request, res: Response) => {
    try {
      const status = req.query.status as SampleStatus | undefined;
      const batches = await batchService.getAllBatches(status);
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  getBatchById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const batch = await batchService.getBatchById(id);
      if (!batch) {
        return res.status(404).json({ error: '批次不存在' });
      }
      res.json(batch);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  createBatch: async (req: Request, res: Response) => {
    try {
      const { batchNo, sourceUnit, samples } = req.body;
      const batch = await batchService.createBatch({
        batchNo,
        sourceUnit,
        samples,
      });
      res.status(201).json(batch);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },

  receiveBatch: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { version, operator } = req.body;
      const batch = await batchService.receiveBatch(id, version, operator);
      res.json(batch);
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith('CONFLICT')) {
        const currentVersion = parseInt(message.split(' ')[1]);
        return res.status(409).json({
          error: 'CONFLICT',
          message: '该批次已被其他用户修改，请刷新后重新操作',
          currentVersion,
        });
      }
      res.status(400).json({ error: message });
    }
  },
};
