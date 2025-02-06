import { Task } from '@/interfaces/task.interface';
import RequestAdapterService from './adapter.service';

class TaskService extends RequestAdapterService {
  async getTasks(status?: string): Promise<Task[]> {
    try {
      const params = status ? { status } : undefined;
      const { data } = await this.sendGetRequest(`/task`, params);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }
  async getMembers(): Promise<any> {
    try {
      const { data } = await this.sendGetRequest(`/members`);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }

  async create(payload: any): Promise<any> {
    try {
      const { data } = await this.sendPostRequest(`/task`, payload);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }
  async update(id: string, payload: any): Promise<any> {
    try {
      const { data } = await this.sendPutRequest(`/task/${id}`, payload);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const { data } = await this.sendDeleteRequest(`/task/${id}`);
      return data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message || error;
    }
  }
}

export default TaskService;
