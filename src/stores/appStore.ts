import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface AppState {
  // Тема
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Состояние загрузки
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Мобильное меню
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Модальные окна
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Уведомления
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  duration?: number; // в миллисекундах, null для постоянного показа
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Тема
        theme: 'system',
        setTheme: theme => set({ theme }, false, 'setTheme'),

        // Состояние загрузки
        isLoading: false,
        setIsLoading: isLoading => set({ isLoading }, false, 'setIsLoading'),

        // Мобильное меню
        isMobileMenuOpen: false,
        setIsMobileMenuOpen: isMobileMenuOpen =>
          set({ isMobileMenuOpen }, false, 'setIsMobileMenuOpen'),
        toggleMobileMenu: () =>
          set(
            state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }),
            false,
            'toggleMobileMenu'
          ),

        // Модальные окна
        activeModal: null,
        openModal: modalId => set({ activeModal: modalId }, false, 'openModal'),
        closeModal: () => set({ activeModal: null }, false, 'closeModal'),

        // Уведомления
        notifications: [],
        addNotification: notification => {
          const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
          };

          set(
            state => ({
              notifications: [...state.notifications, newNotification],
            }),
            false,
            'addNotification'
          );

          // Автоматическое удаление уведомления
          if (notification.duration !== null) {
            const duration = notification.duration || 5000;
            setTimeout(() => {
              get().removeNotification(newNotification.id);
            }, duration);
          }
        },
        removeNotification: id =>
          set(
            state => ({
              notifications: state.notifications.filter(n => n.id !== id),
            }),
            false,
            'removeNotification'
          ),
        clearNotifications: () =>
          set({ notifications: [] }, false, 'clearNotifications'),
      }),
      {
        name: 'app-store',
        partialize: state => ({
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
);

// Селекторы для оптимизации
export const useTheme = () => useAppStore(state => state.theme);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useNotifications = () => useAppStore(state => state.notifications);
