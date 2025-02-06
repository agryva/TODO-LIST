import RequestAdapterService from './adapter.service';

class AuthService extends RequestAdapterService {
  async register(payload: any): Promise<any> {
    try {
      await this.sendPostRequest(`/auth/register`, payload);
      return;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }
  async login(payload: any): Promise<any> {
    try {
      const { data } = await this.sendPostRequest(`/auth/login`, payload);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }
}

export default AuthService;
