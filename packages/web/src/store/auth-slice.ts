import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { accessToken } from '../keywords';
import { apiClient, configApiClient } from '../util/apiClient';

export interface AuthState {
  value: Record<string, any> | null;
}

interface RefreshAuthOptions {
  accessToken?: string;
}

export const refreshAuth = createAsyncThunk(
  'auth/refreshAuth',
  async (options?: RefreshAuthOptions) => {
    if (options?.accessToken)
      localStorage.setItem(accessToken, options.accessToken);

    configApiClient();

    try {
      const { data } = await apiClient.get('auth/whoami');

      return { value: data };
    } catch {
      return { value: null };
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: { value: null } satisfies AuthState,
  reducers: {
    logout: () => {
      localStorage.removeItem(accessToken);

      return { value: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshAuth.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
