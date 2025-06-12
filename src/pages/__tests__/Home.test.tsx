import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Home from '../Home';
import * as githubStore from '../../store/githubStore';
import * as githubApi from '../../api/githubApi';
import * as baseApi from '../../api/baseApi';

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: true,
  }),
}));

const setUsers = vi.fn();
const setPage = vi.fn();
const setHasMore = vi.fn();
const setLoading = vi.fn();

const defaultStore = {
  users: [],
  page: 1,
  hasMore: true,
  loading: false,
  setUsers,
  setPage,
  setHasMore,
  setLoading,
};

vi.spyOn(baseApi, 'useApi').mockReturnValue({
  callApi: vi.fn(),
});

vi.spyOn(githubApi, 'fetchGithubUsers').mockResolvedValue([
  {
    login: 'dono',
    avatar_url: 'https://test.com/dono.png',
    html_url: 'https://test.com/dono',
  },
]);

describe('Home component is rendered', () => {
  beforeEach(() => {
    vi.spyOn(githubStore, 'useGitHubStore').mockReturnValue({
      ...defaultStore,
      users: [],
      page: 1,
      hasMore: true,
      loading: false,
    });
    setUsers.mockClear();
    setPage.mockClear();
    setHasMore.mockClear();
    setLoading.mockClear();
  });

  it('renders search input and button', () => {
    render(<Home />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-btn')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it('calls fetchGithubUsers function and updates state on search', async () => {
    render(<Home />);
    const input = screen.getByTestId('search-input');
    const btn = screen.getByTestId('search-btn');

    fireEvent.change(input, { target: { value: 'dono' } });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(setLoading).toHaveBeenCalledWith(true);
    });

    await waitFor(() => {
      expect(setUsers).toHaveBeenCalled();
    });
    expect(setPage).toHaveBeenCalledWith(1);
    expect(setHasMore).toHaveBeenCalledWith(true);
  });

  it('shows loading spinner', () => {
    vi.spyOn(githubStore, 'useGitHubStore').mockReturnValue({
      ...defaultStore,
      loading: true,
    });
    render(<Home />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows total result when data exists', async () => {
    render(<Home />);
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'dono' } });
    fireEvent.click(screen.getByTestId('search-btn'));

    await waitFor(() => {
      expect(screen.getByText(/Showing/i)).toBeInTheDocument();
      expect(screen.getByText(/"dono"/)).toBeInTheDocument();
    });
  });
});
