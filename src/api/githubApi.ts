import type { GitHubRepoInterface, GitHubUserInterface } from '../types/githubTypes';

export const fetchGithubUsers = async (
  callApi: ReturnType<typeof import('./baseApi').useApi>['callApi'],
  query: string,
  page: number = 1,
  perPage: number = 5
): Promise<GitHubUserInterface[]> => {
  const res = await callApi<{ items: GitHubUserInterface[] }>({
    method: 'GET',
    subUrl: `/search/users`,
    data: { q: query, per_page: perPage, page },
  });
  return res.data.items;
};

export const fetchGithubRepos = async (
  callApi: ReturnType<typeof import('./baseApi').useApi>['callApi'],
  username: string
): Promise<GitHubRepoInterface[]> => {
  const res = await callApi<GitHubRepoInterface[]>({
    method: "GET",
    subUrl: `/users/${username}/repos`,
  });
  return res.data;
};