import { ProfileInterface } from '@/interfaces/user.interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStoreInterface {
  token?: string;
  user?: ProfileInterface;
  setToken: (token: string | undefined) => void;
  setUser: (user: ProfileInterface | undefined) => void;
  logout: () => void;
}

const useAuthStore = create(
  persist<AuthStoreInterface>(
    (set) => ({
      token: undefined,
      user: undefined,
      setToken: (token: string | undefined) => set({ token }),
      setUser: (user: ProfileInterface | undefined) => set({ user }),
      logout: () => set({ token: undefined, user: undefined }),
    }),
    {
      name: 'auth_store', // Simpan di localStorage
    }
  )
);

export default useAuthStore;
