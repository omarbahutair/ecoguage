import { configureStore } from '@reduxjs/toolkit';
import { authReducer, AuthState } from './auth-slice';

export interface IStore {
  auth: AuthState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export const dispatch = store.dispatch;
