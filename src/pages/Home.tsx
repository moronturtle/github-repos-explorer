import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { useGitHubStore } from '../store/githubStore';
import { useApi } from '../api/baseApi';
import LoadingSpinner from '../components/LoadingSpinner';
import UserAccordionList from '../components/UserAccordionList';
import { fetchGithubUsers } from '../api/githubApi';

interface FormInput {
  username: string;
}

const PER_PAGE = 3;

const Home = () => {
  const { users, page, hasMore, loading, setUsers, setPage, setHasMore, setLoading } =
    useGitHubStore();
  const { callApi } = useApi();

  const [searchQuery, setSearchQuery] = useState('');
  const { register, handleSubmit } = useForm<FormInput>();
  const { ref: loaderRef, inView } = useInView();

  const fetchUsers = useCallback(
    async (query: string, pageNum: number, reset = false) => {
      setLoading(true);
      try {
        const users = await fetchGithubUsers(callApi, query, pageNum, PER_PAGE);
        setUsers(users, reset);
        setHasMore(users.length === PER_PAGE);
      } catch {
        if (reset) setUsers([], true);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [callApi, setUsers, setHasMore, setLoading]
  );

  const onSubmit = async (data: FormInput) => {
    const query = data.username.trim();
    setSearchQuery(query);
    setPage(1);
    setHasMore(true);
    setUsers([], true);
    await fetchUsers(query, 1, true);
  };

  useEffect(() => {
    if (!inView || loading || !searchQuery || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers(searchQuery, nextPage);
  }, [inView, loading, hasMore, searchQuery, fetchUsers, page, setPage]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-cyan-100 via-white to-cyan-200 flex justify-center items-start py-8 px-2">
      <div className="w-full max-w-xl">
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl px-4 pb-6 pt-4 mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center pb-2 tracking-wide text-cyan-700 drop-shadow-sm select-none">
            GitHub Explorer
          </h1>
          <form
            className="flex flex-col gap-2 md:gap-3"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <input
              {...register('username')}
              data-testid="search-input"
              type="text"
              className="input input-bordered w-full rounded-xl px-3 py-2 text-sm md:text-base bg-white/80 border border-white/50 shadow focus:border-cyan-500 focus:outline-none"
              placeholder="Enter username"
            />
            <button
              data-testid="search-btn"
              type="submit"
              className="btn bg-cyan-500 hover:bg-cyan-600 text-white border border-cyan-400 focus:ring-2 focus:ring-cyan-400 rounded-xl text-sm md:text-base font-semibold py-2 px-4 shadow-md transition-all"
            >
              Search
            </button>
          </form>
          {searchQuery && (
            <div className="bg-white/70 mt-3 text-gray-600 text-xs md:text-sm py-2 px-2 rounded shadow">
              Showing {users.length} result{users.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-gray-800">"{searchQuery}"</span>
            </div>
          )}
        </div>

        <div className="mt-2 space-y-2">
          <UserAccordionList />
          {loading && <LoadingSpinner />}
          {!loading && hasMore && users.length > 0 && (
            <div ref={loaderRef} className="flex justify-center py-4 opacity-70">
              <span className="bg-white/80 px-3 py-1 rounded-full text-sm text-cyan-700 shadow">
                Loading more...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
