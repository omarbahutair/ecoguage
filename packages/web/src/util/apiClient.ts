import axios from 'axios';
import { accessToken } from '../keywords';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
});

export const configApiClient = () => {
  const token = localStorage.getItem(accessToken);

  if (token) apiClient.defaults.headers.Authorization = token;
};
