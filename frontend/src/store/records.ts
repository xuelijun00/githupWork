import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { Record, GetRecordsQuery } from '../types';

interface RecordsState {
  items: Record[];
  loading: boolean;
  error: string | null;
}

const initialState: RecordsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (query?: GetRecordsQuery) => {
    return api.records.getAll(query);
  }
);

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch records';
      });
  },
});

export default recordsSlice.reducer;
