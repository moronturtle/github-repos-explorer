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
    <ul className="mt-2 space-y-2">
      {users.map((user, key) => (
        <li key={user.login}>
          <button
            onClick={() => handleToggle(key, user)}
            className={`
              flex justify-between items-center w-full px-4 py-2
              bg-white/60 hover:bg-white/90
              rounded-xl shadow-md transition-all text-left font-medium
              border border-white/30
              text-sm md:text-base
              backdrop-blur cursor-pointer
              ${selectedUser === key ? 'ring-2 ring-cyan-300' : ''}
            `}
          >
            <span className="flex items-center gap-3">
              <img
                src={user.avatar_url}
                className="w-7 h-7 rounded-full border border-white/60 shadow"
                alt={user.login}
              />
              <span className="truncate">{user.login}</span>
            </span>
            <span className="text-lg md:text-xl">
              {selectedUser === key ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
