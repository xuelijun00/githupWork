import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Sample } from '../types';

interface SamplesState {
  items: Sample[];
  loading: boolean;
  error: string | null;
}

const initialState: SamplesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSamples = createAsyncThunk(
  'samples/fetchSamples',
  async (batchId: string) => {
    return api.samples.getByBatchId(batchId);
  }
);

export const reviewSample = createAsyncThunk(
  'samples/reviewSample',
  async ({
    id,
    version,
    operator,
    result,
    abnormalReason,
  }: {
    id: string;
    version: number;
    operator: string;
    result: 'pass' | 'abnormal';
    abnormalReason?: string;
  }) => {
    return api.samples.review(id, { version, operator, result, abnormalReason });
  }
);

export const resolveAbnormal = createAsyncThunk(
  'samples/resolveAbnormal',
  async ({
    id,
    version,
    operator,
  }: {
    id: string;
    version: number;
    operator: string;
  }) => {
    return api.samples.resolveAbnormal(id, { version, operator });
  }
);

const samplesSlice = createSlice({
  name: 'samples',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSamples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSamples.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSamples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch samples';
      })
      .addCase(reviewSample.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(resolveAbnormal.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default samplesSlice.reducer;
