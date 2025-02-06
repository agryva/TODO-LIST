export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TaskMember {
  id: string;
  user_id: string;
  task_id: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'NOT_STARTED';
  created_at: string;
  updated_at: string;
  user_id: string;
  user: User;
  task_members: TaskMember[];
}
