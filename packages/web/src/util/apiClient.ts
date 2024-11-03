import axios from 'axios';
import { accessToken } from '../keywords';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
});

export const configApiClient = () => {
  apiClient.interceptors.request.use((value) => {
    const token = localStorage.getItem(accessToken);

    if (token) value.headers.Authorization = token;

    return value;
  });
};
