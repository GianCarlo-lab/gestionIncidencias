import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppUser } from '@types-app/index'

interface AuthState {
  user: AppUser | null
  isAuthenticated: boolean
  setUser: (user: AppUser | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: user !== null }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'pide-servicio-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
