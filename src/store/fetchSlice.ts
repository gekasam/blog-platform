import { createSlice, createAsyncThunk, Action, PayloadAction } from '@reduxjs/toolkit';

import type { ArticlesList } from '../models/articles';

type FetchState = {
  articles: ArticlesList | Record<string, never>;
  loading: boolean;
  error: string;
};

const baseURL = 'https://blog.kata.academy/api';

export const fetchArticles = createAsyncThunk<ArticlesList, undefined, { rejectValue: string }>(
  'fetch/articles',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/articls `);
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
    }
    return data;
  }
);

const initialState: FetchState = {
  articles: {},
  loading: false,
  error: '',
};

function isError(action: Action) {
  return action.type.endsWith('rejected');
}

const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articles = action.payload;
        state.loading = false;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      });
  },
});

export default fetchSlice;
