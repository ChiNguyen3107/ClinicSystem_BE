import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebar: {
    isOpen: boolean;
    isCollapsed: boolean;
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
  };
  layout: {
    headerHeight: number;
    sidebarWidth: number;
    collapsedSidebarWidth: number;
  };
}

interface UIActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setNotifications: (notifications: Partial<UIState['notifications']>) => void;
  setLayout: (layout: Partial<UIState['layout']>) => void;
}

export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set, get) => ({
      // State
      theme: 'light',
      sidebar: {
        isOpen: true,
        isCollapsed: false,
      },
      notifications: {
        enabled: true,
        sound: true,
      },
      layout: {
        headerHeight: 64,
        sidebarWidth: 256,
        collapsedSidebarWidth: 64,
      },

      // Actions
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        // Apply theme to document
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },

      setSidebarOpen: (isOpen: boolean) => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen },
        }));
      },

      setSidebarCollapsed: (isCollapsed: boolean) => {
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed },
        }));
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen },
        }));
      },

      toggleSidebarCollapse: () => {
        set((state) => ({
          sidebar: { ...state.sidebar, isCollapsed: !state.sidebar.isCollapsed },
        }));
      },

      setNotifications: (notifications) => {
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        }));
      },

      setLayout: (layout) => {
        set((state) => ({
          layout: { ...state.layout, ...layout },
        }));
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebar: state.sidebar,
        notifications: state.notifications,
        layout: state.layout,
      }),
    }
  )
);
