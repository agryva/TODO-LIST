import useAuthStore from '@/stores/auth.store';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  ResponseType,
} from 'axios';
import { deleteCookie } from 'cookies-next';

class RequestAdapterService {
  reqClient: AxiosInstance;

  constructor() {
    const requestHeader: { [key: string]: any } = {
      'Content-Type': 'application/json',
    };

    const token = useAuthStore.getState().token;

    if (token && typeof token !== 'undefined') {
      requestHeader['Authorization'] = `Bearer ${token}`;
    }

    this.reqClient = axios.create({
      headers: requestHeader,
    });

    this.reqClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error?.response?.status === 403) {
          useAuthStore.getState().setToken(undefined);
          useAuthStore.getState().setUser(undefined);
          deleteCookie('token')
          if (error.config?.url && !error.config.url.includes('/')) {
            window.location.href = '/';
          }
          throw error;
        }

        if (error?.code === 'ERR_NETWORK') {
          throw {
            response: {
              data: {
                message: 'Terjadi kesalahan pada server',
              },
            },
          };
        }
        const er: any = error?.response?.data;

        if (er?.error) {
          let message: string;

          if (typeof er.error === 'string') {
            message = er.error;
          } else if (typeof er.error === 'object' && Array.isArray(er.error)) {
            message = er.error.map((error: any) => error.message).join(', '); // Combine messages
          } else {
            console.warn('Unexpected error structure:', er.error);
            message = 'An unexpected error occurred.';
          }

          throw {
            response: {
              data: {
                message,
              },
            },
          };
        }
      }
    );
  }

  async sendGetRequest(
    URL: string,
    params?: { [key: string]: any },
    rawRequest = false
  ) {
    if (!rawRequest) URL = process.env.NEXT_PUBLIC_API_ENDPOINT + URL;

    const response = await this.reqClient.get(URL, { params });
    return response;
  }

  async sendGetRequestForDownload(
    URL: string,
    params?: { [key: string]: string },

    rawRequest = false,
    responseType: ResponseType = 'blob'
  ) {
    if (!rawRequest) URL = process.env.NEXT_PUBLIC_API_ENDPOINT + URL;

    const response = await this.reqClient.get(URL, {
      params,
      responseType: responseType,
    });
    return response;
  }

  async sendPostRequest(
    URL: string,
    requestBody?: { [key: string]: any },
    rawRequest = false,
    config?: { [key: string]: any }
  ) {
    if (!rawRequest) URL = process.env.NEXT_PUBLIC_API_ENDPOINT + URL;

    const response = await this.reqClient.post(URL, requestBody, { ...config });
    return response;
  }

  async sendPostMultipartRequest(
    URL: string,
    formData: any,
    rawRequest = false
  ) {
    if (!rawRequest) URL = process.env.NEXT_PUBLIC_API_ENDPOINT + URL;

    const response = this.reqClient.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  }

  async sendPutRequest(
    URL: string,
    requestBody: { [key: string]: any },
    rawRequest = false
  ) {
    if (!rawRequest) URL = process.env.NEXT_PUBLIC_API_ENDPOINT + URL;

    const response = await this.reqClient.put(URL, requestBody);
    return response;
  }

  async sendDeleteRequest(
    URL: string,
    data?: { [key: string]: any },
    rawRequest = false
  ) {
    if (!rawRequest) URL = process.env.NEXT_PUBLIC_API_ENDPOINT + URL;

    const response = await this.reqClient.delete(URL, { data });
    return response;
  }
}

export default RequestAdapterService;
