import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  type: 'info',
  showToast: (message, type = 'info') =>
    set({ open: true, message, type }),
  hideToast: () => set({ open: false, message: '' }),
}));
