import { render, screen } from '@testing-library/react';
import RepoCardList from '../RepoCardList';
import type { GitHubRepoInterface } from '../../types/githubTypes';
import { describe, expect, it } from 'vitest';

describe('RepoCardList', () => {
  const repos: GitHubRepoInterface[] = [
    {
      id: 1,
      name: 'dummy-repo-1',
      html_url: 'https://github.com/user/dummy-repo-1',
      stargazers_count: 123,
      description: 'dummy repo 1 description',
    },
    {
      id: 2,
      name: 'dummy-repo-2',
      html_url: 'https://github.com/user/dummy-repo-2',
      stargazers_count: 7,
      description: '',
    },
  ];

  it('"No repository found" when repos is empty', () => {
    render(<RepoCardList repos={[]} />);
    expect(screen.getByText(/no repository found/i)).toBeInTheDocument();
  });

  it('renders list of repos', () => {
    render(<RepoCardList repos={repos} />);

    expect(screen.getByText('dummy-repo-1')).toBeInTheDocument();
    expect(screen.getByText('dummy-repo-2')).toBeInTheDocument();

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    expect(screen.getByText('dummy repo 1 description')).toBeInTheDocument();
  });

  it('repo name links to correct GitHub URL', () => {
    render(<RepoCardList repos={repos} />);
    const link = screen.getByText('dummy-repo-1').closest('a');
    expect(link).toHaveAttribute('href', 'https://github.com/user/dummy-repo-1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
