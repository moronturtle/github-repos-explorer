/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
// import { useToast } from '../context/ToastContext';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Payload = Record<string, any>;

interface CallParamsInterface {
  method: Method;
  subUrl?: string;
  data?: any;
  options?: Record<string, any>;
  contentType?: string;
}

export const useApi = () => {
  // const { showToast } = useToast();

  const instance = axios.create({
    baseURL: 'https://api.jikan.moe/v4',
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      // const status = err?.response?.status;
      // const msg = err?.response?.data?.message || 'Something went wrong.';

      // if (status === 401) showToast('Unauthorized access.', 'warning');
      // else if (status === 403) showToast('You do not have permission to access this resource.', 'error');
      // else if (status === 404) showToast('Requested URL resource not found.', 'error');
      // else showToast(msg || 'An error occurred. Please try again later.', 'error');

      return Promise.reject(err);
    }
  );

  const call = async ({
    method,
    subUrl,
    data,
    contentType = 'application/json',
  }: CallParamsInterface) => {
    const config = {
      method,
      url: subUrl,
      baseURL: instance.defaults.baseURL,
      headers: {
        'Content-Type': contentType,
      },
      params: method === 'GET' ? cleanPayload(data) : undefined,
      data: method !== 'GET' ? data : undefined,
    };

    try {
      const res = await instance.request(config);
      return res.data;
    } catch {
      return null;
    }
  };

  return { call };
};

const cleanPayload = (payload: Payload) => {
  const clean = { ...payload };
  Object.keys(clean).forEach((key) => {
    if (clean[key] === null || clean[key] === undefined || clean[key] === '') {
      delete clean[key];
    }
  });
  return clean;
};
