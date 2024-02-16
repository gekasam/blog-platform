import { createSlice, createAsyncThunk, Action, PayloadAction } from '@reduxjs/toolkit';

import type { Article, ArticlesList } from '../models/articles';

type FetchState = {
  articlesFetchData: {
    articles: ArticlesList;
    articlesCount: number;
  };
  currentArticle: Article | null;
  loading: boolean;
  error: string;
};

const baseURL = 'https://blog.kata.academy/api';

export const fetchArticles = createAsyncThunk<
  FetchState['articlesFetchData'],
  number,
  { rejectValue: string }
>(
  'fetch/articles',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (offset, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/articles?limit=5&offset=${offset}`);
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
    }
    return data;
  }
);

export const fetchArticle = createAsyncThunk<Article, string, { rejectValue: string }>(
  'fetch/article',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (slug, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/articles/${slug}`);
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
    }
    return data.article;
  }
);

const initialState: FetchState = {
  articlesFetchData: {
    articles: [],
    articlesCount: 0,
  },
  currentArticle: null,
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
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articlesFetchData.articles = action.payload.articles;
        state.articlesFetchData.articlesCount = action.payload.articlesCount;
        state.loading = false;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      });
  },
});

export default fetchSlice;
