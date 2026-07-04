import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import batchRoutes from './routes/batchRoutes';
import sampleRoutes from './routes/sampleRoutes';
import recordRoutes from './routes/recordRoutes';
import { prisma } from './utils/prisma';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/batches', batchRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/records', recordRoutes);

app.use(errorHandler);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
