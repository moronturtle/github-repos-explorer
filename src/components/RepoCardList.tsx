import type { GitHubRepoInterface } from '../types/githubTypes';
import { Star } from 'lucide-react';

const RepoCardList = ({ repos }: { repos: GitHubRepoInterface[] }) => {
  if (!repos.length)
    return <div className="text-gray-400 text-xs italic px-2 py-2">No repository found</div>;

  return (
    <div className="space-y-2">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="bg-white/60 backdrop-blur rounded-lg px-4 py-2 shadow-md border border-white/20 flex flex-col"
        >
          <div className="flex justify-between items-center">
            <a
              href={repo.html_url}
              className="font-semibold text-cyan-700 hover:underline text-sm truncate cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              title={repo.name}
            >
              {repo.name}
            </a>
            <span className="flex items-center gap-1 text-xs text-yellow-500">
              <Star size={15} className="inline-block -mt-0.5" />
              <span className="font-semibold">{repo.stargazers_count}</span>
            </span>
          </div>
          {repo.description && (
            <div className="text-gray-500 text-xs mt-1 truncate">{repo.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RepoCardList;
