import { createSlice, createAsyncThunk, Action, PayloadAction } from '@reduxjs/toolkit';

import type { Article, ArticlesList, CreateArticleBody } from '../models/articles';
import { ProfileEditingBody, User, UserCreationBody, UserLoginBody } from '../models/users';

type FetchState = {
  articlesFetchData: {
    articles: ArticlesList;
    articlesCount: number;
  };
  usersFetchData: {
    currentUser: User | null;
  };
  currentArticle: Article | null;
  loading: boolean;
  error: string | { username?: string; email?: string };
  isDeleteSucsess: boolean;
};

const baseURL = 'https://blog.kata.academy/api';

export const fetchArticles = createAsyncThunk<
  FetchState['articlesFetchData'],
  { offset: number; token: string | null },
  { rejectValue: string }
>(
  'fetch/articles',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (args, { rejectWithValue }) => {
    let response;
    if (args.token) {
      response = await fetch(`${baseURL}/articles?limit=5&offset=${args.offset}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${args.token}`,
        },
      });
    } else {
      response = await fetch(`${baseURL}/articles?limit=5&offset=${args.offset}`);
    }
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
    }
    return data;
  }
);

export const fetchArticle = createAsyncThunk<
  Article,
  { slug: string; token: string | null },
  { rejectValue: string }
>(
  'fetch/article',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (args, { rejectWithValue }) => {
    let response;
    if (args.token) {
      response = await fetch(`${baseURL}/articles/${args.slug}`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${args.token}`,
        },
      });
    } else {
      response = await fetch(`${baseURL}/articles/${args.slug}`);
    }
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
    }
    return data.article;
  }
);

export const fetchCreateUser = createAsyncThunk<User, UserCreationBody, { rejectValue: string }>(
  'fetch/createUser',
  async (body, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      if (!('username' in data.errors) && !('email' in data.errors)) {
        if ('email or password' in data.errors) {
          return rejectWithValue('Error, email or password is invalid');
        }
        return rejectWithValue(`Error, ${data.errors.message}`);
      }
      return rejectWithValue(data.errors);
    }
    return data.user;
  }
);

export const fetchLogin = createAsyncThunk<User, UserLoginBody, { rejectValue: string }>(
  'fetch/login',
  async (body, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const message = Object.entries(data.errors)
        .map(({ 0: key, 1: value }) => `${key} ${value}`)
        .join(' ');
      return rejectWithValue(`Error, ${message}`);
    }
    return data.user;
  }
);

export const fetchUser = createAsyncThunk<User, string, { rejectValue: string }>(
  'fetch/user',
  async (token, { rejectWithValue }) => {
    const response = await fetch(`${baseURL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(`Server Error ${response.status} ${data.errors.message}`);
    }
    return data.user;
  }
);

export const fetchProfileEdit = createAsyncThunk<
  User,
  { body: ProfileEditingBody; token: string },
  { rejectValue: string }
>('fetch/profileEdit', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseURL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${args.token}`,
    },
    body: JSON.stringify(args.body),
  });
  const data = await response.json();
  if (!response.ok) {
    if (!('username' in data.errors) && !('email' in data.errors)) {
      return rejectWithValue(`Error, ${data.errors.message}`);
    }
    return rejectWithValue(data.errors);
  }
  return data.user;
});

export const fetchCreateArticle = createAsyncThunk<
  Article,
  { body: CreateArticleBody; token: string },
  { rejectValue: string }
>('fetch/createArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseURL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${args.token}`,
    },
    body: JSON.stringify(args.body),
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

export const fetchEditArticle = createAsyncThunk<
  Article,
  { body: CreateArticleBody; token: string; slug: string },
  { rejectValue: string }
>('fetch/editArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseURL}/articles/${args.slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${args.token}`,
    },
    body: JSON.stringify(args.body),
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

export const fetchDeleteArticle = createAsyncThunk<
  string,
  { token: string; slug: string },
  { rejectValue: string }
>('fetch/deleteArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseURL}/articles/${args.slug}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    return rejectWithValue(`Error, ${data.errors.message}`);
  }
  return '';
});

export const fetchFavoriteArticle = createAsyncThunk<
  Article,
  { token: string; slug: string },
  { rejectValue: string }
>('fetch/favoriteArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseURL}/articles/${args.slug}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

export const fetchUnfavoriteArticle = createAsyncThunk<
  Article,
  { token: string; slug: string },
  { rejectValue: string }
>('fetch/unfavoriteArticle', async (args, { rejectWithValue }) => {
  const response = await fetch(`${baseURL}/articles/${args.slug}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${args.token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return rejectWithValue(data.errors.message);
  }
  return data.article;
});

const initialState: FetchState = {
  articlesFetchData: {
    articles: [],
    articlesCount: 0,
  },
  usersFetchData: {
    currentUser: null,
  },
  currentArticle: null,
  loading: false,
  error: '',
  isDeleteSucsess: false,
};

function isError(action: Action) {
  return action.type.endsWith('rejected');
}

const fetchSlice = createSlice({
  name: 'fetch',
  initialState,
  reducers: {
    logOut: (state) => {
      localStorage.removeItem('token');
      state.usersFetchData.currentUser = null;
    },
    clearError: (state, action) => {
      if (action.payload === 'all') {
        state.error = '';
      } else if (typeof state.error === 'object' && action.payload === 'email') {
        delete state.error.email;
      } else if (typeof state.error === 'object' && action.payload === 'username') {
        delete state.error.username;
      }
      if (!Object.keys(state.error).length) {
        state.error = '';
      }
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearDeleteState: (state) => {
      state.isDeleteSucsess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticle.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchArticles.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.articlesFetchData.articles = action.payload.articles;
        state.articlesFetchData.articlesCount = action.payload.articlesCount;
        state.loading = false;
      })
      .addCase(fetchCreateArticle.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchCreateArticle.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchEditArticle.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchEditArticle.fulfilled, (state, action) => {
        state.currentArticle = action.payload;
        state.loading = false;
      })
      .addCase(fetchDeleteArticle.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchDeleteArticle.fulfilled, (state) => {
        state.loading = false;
        state.isDeleteSucsess = true;
      })
      .addCase(fetchFavoriteArticle.pending, (state) => {
        state.error = '';
        /* state.loading = true; */
      })
      .addCase(fetchFavoriteArticle.fulfilled, (state, action) => {
        state.articlesFetchData.articles[
          state.articlesFetchData.articles?.findIndex(
            (article) => article.slug === action.payload.slug
          )
        ] = action.payload;
        state.currentArticle = action.payload;
        /* state.loading = false; */
      })
      .addCase(fetchUnfavoriteArticle.pending, (state) => {
        state.error = '';
        /* state.loading = true; */
      })
      .addCase(fetchUnfavoriteArticle.fulfilled, (state, action) => {
        state.articlesFetchData.articles[
          state.articlesFetchData.articles?.findIndex(
            (article) => article.slug === action.payload.slug
          )
        ] = action.payload;
        state.currentArticle = action.payload;
        /* state.loading = false; */
      })
      .addCase(fetchCreateUser.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchCreateUser.fulfilled, (state, action) => {
        state.usersFetchData.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.usersFetchData.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.usersFetchData.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addCase(fetchProfileEdit.pending, (state) => {
        state.error = '';
        state.loading = true;
      })
      .addCase(fetchProfileEdit.fulfilled, (state, action) => {
        state.usersFetchData.currentUser = action.payload;
        localStorage.setItem('token', action.payload.token);
        state.loading = false;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearError, logOut, clearCurrentArticle, clearDeleteState } = fetchSlice.actions;

export default fetchSlice.reducer;
