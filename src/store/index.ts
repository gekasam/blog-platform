import { configureStore } from '@reduxjs/toolkit';

import fetchSlice from './fetchSlice';

const store = configureStore({
  reducer: {
    fetchSlice: fetchSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
