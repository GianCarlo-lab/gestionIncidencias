import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  unreadNotifications: number
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setUnreadNotifications: (count: number) => void
  incrementUnreadNotifications: () => void
  clearNotifications: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: false,
  unreadNotifications: 0,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setUnreadNotifications: (count) => set({ unreadNotifications: count }),
  incrementUnreadNotifications: () =>
    set((state) => ({ unreadNotifications: state.unreadNotifications + 1 })),
  clearNotifications: () => set({ unreadNotifications: 0 }),
}))
