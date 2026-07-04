import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Batch, SampleStatus } from '../types';

interface BatchesState {
  items: Batch[];
  loading: boolean;
  error: string | null;
}

const initialState: BatchesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBatches = createAsyncThunk('batches/fetchBatches', async (status?: SampleStatus) => {
  return api.batches.getAll(status);
});

export const fetchBatchById = createAsyncThunk('batches/fetchBatchById', async (id: string) => {
  return api.batches.getById(id);
});

export const receiveBatch = createAsyncThunk(
  'batches/receiveBatch',
  async ({ id, version, operator }: { id: string; version: number; operator: string }) => {
    return api.batches.receive(id, { version, operator });
  }
);

const batchesSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch batches';
      })
      .addCase(receiveBatch.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default batchesSlice.reducer;
