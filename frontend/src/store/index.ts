import { configureStore } from '@reduxjs/toolkit';
import batchesReducer from './batches';
import samplesReducer from './samples';
import recordsReducer from './records';

export const store = configureStore({
  reducer: {
    batches: batchesReducer,
    samples: samplesReducer,
    records: recordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
