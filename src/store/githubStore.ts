import { create } from "zustand";
import type { GitHubUserInterface, GitHubRepoInterface } from "../types/githubTypes";

interface GitHubStateInterface {
  users: GitHubUserInterface[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  setUsers: (users: GitHubUserInterface[], reset?: boolean) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  repos: GitHubRepoInterface[];
  setRepos: (repos: GitHubRepoInterface[]) => void;
}

export const useGitHubStore = create<GitHubStateInterface>((set) => ({
  users: [],
  page: 1,
  hasMore: true,
  loading: false,
  setUsers: (users, reset = false) =>
    set((state) => ({
      users: reset ? users : [...state.users, ...users],
    })),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (loading) => set({ loading }),
  repos: [],
  setRepos: (repos) => set({ repos }),
}));
