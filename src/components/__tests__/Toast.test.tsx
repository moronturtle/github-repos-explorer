import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from 'zustand';
import * as toastStore from '../../store/toastStore';
import Toast from '../Toast';
import type { ToastStoreInterface } from '../../types/githubTypes';

const createTestToastStore = (initState?: ToastStoreInterface) =>
  create(() => ({
    open: true,
    message: 'Test of Toast',
    type: 'success',
    hideToast: vi.fn(),
    ...initState,
  }));

describe('Toast component', () => {
  let store: ReturnType<typeof createTestToastStore>;

  beforeEach(() => {
    store = createTestToastStore();
    vi.spyOn(toastStore, 'useToastStore').mockImplementation(store);
  });

  it('renders message and icon based on type', () => {
    render(<Toast />);
    expect(screen.getByText('Test of Toast')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should hide toast after timeout', async () => {
    vi.useFakeTimers();
    const hideToastMock = vi.fn(() => {
      store.setState({ open: false });
    });
    store.setState({ hideToast: hideToastMock, open: true });

    render(<Toast />);
    expect(screen.getByText('Test of Toast')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2100);
    });
    await act(async () => {});

    expect(hideToastMock).toHaveBeenCalled();
    expect(screen.queryByText('Test of Toast')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should close toast when close icon is clicked', () => {
    const hideToastMock = vi.fn(() => {
      store.setState({ open: false });
    });
    store.setState({ hideToast: hideToastMock, open: true });

    render(<Toast />);
    const closeButton = screen.getByTestId('toast-close');
    fireEvent.click(closeButton);

    expect(hideToastMock).toHaveBeenCalled();
    expect(screen.queryByText('Test of Toast')).not.toBeInTheDocument();
  });
});
