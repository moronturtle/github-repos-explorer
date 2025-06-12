import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useGitHubStore } from '../store/githubStore';
import { useApi } from '../api/baseApi';
import type { GitHubUserInterface, GitHubRepoInterface } from '../types/githubTypes';
import RepoCardList from './RepoCardList';
import LoadingSpinner from './LoadingSpinner';
import { fetchGithubRepos } from '../api/githubApi';

const UserAccordionList = () => {
  const { users } = useGitHubStore();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [repos, setRepos] = useState<GitHubRepoInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const { callApi } = useApi();

  const handleToggle = async (key: number, user: GitHubUserInterface) => {
    if (selectedUser === key) {
      setSelectedUser(null);
      setRepos([]);
      return;
    }
    setSelectedUser(key);
    setRepos([]);
    setLoading(true);
    try {
      const repos = await fetchGithubRepos(callApi, user.login);
      setRepos(repos);
    } catch {
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  if (!users.length) return null;

  return (
    <ul className="mt-4">
      {users.map((user, key) => (
        <li key={user.login} className="mb-2">
          <button
            onClick={() => handleToggle(key, user)}
            className={`flex justify-between items-center w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow transition text-left font-semibold ${
              selectedUser === key ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <img src={user.avatar_url} className="w-6 h-6 rounded-full" alt={user.login} />
              {user.login}
            </span>
            <span className="text-xl">
              {selectedUser ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </button>
          {selectedUser === key && (
            <div className="mt-2 ml-2">
              {loading ? <LoadingSpinner /> : <RepoCardList repos={repos} />}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserAccordionList;
