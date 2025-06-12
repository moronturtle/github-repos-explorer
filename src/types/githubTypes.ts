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
