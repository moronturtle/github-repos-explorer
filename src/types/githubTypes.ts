export interface ToastStoreInterface {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  hideToast: () => void;
}

export interface GitHubUserInterface {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepoInterface {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
}
