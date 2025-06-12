import type { GitHubRepoInterface } from "../types/githubTypes";

const RepoCardList = ({ repos }: { repos: GitHubRepoInterface[] }) => {
  if (!repos.length)
    return <div className="text-gray-500 text-sm italic">No repository found</div>;

  return (
    <div className="space-y-3">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="bg-white rounded-lg px-4 py-3 shadow border border-gray-100 flex flex-col"
        >
          <div className="flex justify-between items-center">
            <a href={repo.html_url} className="font-semibold text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
            <span className="flex items-center gap-1 text-xs">
              <span className="font-semibold">{repo.stargazers_count}</span>
              <span>★</span>
            </span>
          </div>
          {repo.description && (
            <div className="text-gray-500 text-sm">{repo.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RepoCardList;
