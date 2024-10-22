import axios from 'axios';
import { accessToken } from '../keywords';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
});

export const configApiClient = () => {
  const token = localStorage.getItem(accessToken);

  apiClient.interceptors.request.use(async (value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, 3000);
    });
  });

  if (token) apiClient.defaults.headers.Authorization = token;
};
