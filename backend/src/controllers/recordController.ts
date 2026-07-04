import { Request, Response } from 'express';
import { recordService } from '../services/recordService';
import { RecordAction } from '../types';

export const recordController = {
  getRecords: async (req: Request, res: Response) => {
    try {
      const query = {
        sampleId: req.query.sampleId as string | undefined,
        batchId: req.query.batchId as string | undefined,
        operator: req.query.operator as string | undefined,
        action: req.query.action as RecordAction | undefined,
        startTime: req.query.startTime as string | undefined,
        endTime: req.query.endTime as string | undefined,
      };
      const records = await recordService.getRecords(query);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
};
