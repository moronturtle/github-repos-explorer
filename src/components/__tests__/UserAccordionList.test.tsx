import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import * as githubStore from '../../store/githubStore';
import * as githubApi from '../../api/githubApi';
import UserAccordionList from '../UserAccordionList';
import type { GitHubRepoInterface } from '../../types/githubTypes';

const users = [
  {
    login: 'dono',
    avatar_url: 'https://example.com/dono.png',
  },
  {
    login: 'dena',
    avatar_url: 'https://example.com/dena.png',
  },
];

vi.spyOn(githubStore, 'useGitHubStore').mockReturnValue({ users });

const mockRepos = [
  {
    id: 1,
    name: 'repo1-dummy',
    html_url: 'https://github.com/dono/repo1-dummy',
    stargazers_count: 5,
    description: 'desc',
  },
];

vi.spyOn(githubApi, 'fetchGithubRepos').mockResolvedValue(mockRepos);

describe('UserAccordionList', () => {
  it('renders user avatars', () => {
    render(<UserAccordionList />);
    expect(screen.getByText('dono')).toBeInTheDocument();
    expect(screen.getByText('dena')).toBeInTheDocument();
    expect(screen.getByAltText('dono')).toBeInTheDocument();
    expect(screen.getByAltText('dena')).toBeInTheDocument();
  });

  it('expands when user clicked to show repo, and collapses on second click', async () => {
    render(<UserAccordionList />);
    const donoButton = screen.getByText('dono').closest('button')!;
    fireEvent.click(donoButton);

    await waitFor(() => {
      expect(screen.getByText('repo1-dummy')).toBeInTheDocument();
    });

    fireEvent.click(donoButton);
    expect(screen.queryByText('repo1-dummy')).not.toBeInTheDocument();
  });

  it('shows loading spinner while fetching data', async () => {
    let resolve: (value: GitHubRepoInterface[]) => void = () => {};
    const promise = new Promise<GitHubRepoInterface[]>((res) => {
      resolve = res;
    });
    vi.spyOn(githubApi, 'fetchGithubRepos').mockReturnValueOnce(promise);

    render(<UserAccordionList />);
    const donoButton = screen.getByText('dono').closest('button')!;
    fireEvent.click(donoButton);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    resolve([]);
  });
});
