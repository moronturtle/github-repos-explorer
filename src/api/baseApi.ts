import axios, {
  type AxiosRequestConfig,
  type Method as AxiosMethod,
  type AxiosResponse,
} from 'axios';
import { useToastStore } from '../store/toastStore';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface CallParamsInterface<T = unknown> {
  method: HttpMethod;
  subUrl?: string;
  data?: T;
  options?: AxiosRequestConfig;
  contentType?: string;
}

const cleanPayload = <T extends Record<string, unknown>>(payload: T): Partial<T> => {
  if (!payload || typeof payload !== 'object') return {};
  const clean = { ...payload };

  (Object.keys(clean) as (keyof T)[]).forEach((key) => {
    const value = clean[key];
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      delete clean[key];
    }
  });

  return clean;
};

export const useApi = () => {
  const { showToast } = useToastStore.getState();

  const instance = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'User-Agent': 'MyAwesome-GitHubExplorer',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || 'Something went wrong.';

      if (status === 401) showToast('Unauthorized access.', 'warning');
      else if (status === 403)
        showToast('You do not have permission to access this resource.', 'error');
      else if (status === 404) showToast('Requested URL resource not found.', 'error');
      else if (status === 422) showToast('Username github need to be filled.', 'warning');
      else showToast(msg, 'error');

      return Promise.reject(error);
    }
  );

  const callApi = async <TResponse = unknown, TData = unknown>({
    method,
    subUrl = '',
    data,
    options,
    contentType,
  }: CallParamsInterface<TData>): Promise<AxiosResponse<TResponse>> => {
    const headers: Record<string, string> = {};

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    const config: AxiosRequestConfig = {
      url: subUrl,
      method: method as AxiosMethod,
      headers,
      ...options,
      params: method === 'GET' ? cleanPayload((data ?? {}) as Record<string, unknown>) : undefined,
      data: method !== 'GET' ? data : undefined,
    };

    return instance.request<TResponse>(config);
  };

  return { callApi };
};
