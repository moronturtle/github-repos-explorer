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
    <div className="max-w-xl mx-auto p-4">
      <div className="sticky top-0 z-20 bg-teal-50 backdrop-blur py-4">
        <h1 className="text-xl sm:text-xl md:text-2xl font-bold text-center pb-3 tracking-wide">
          GitHub Explorer
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <input
            {...register('username')}
            type="text"
            className="input input-bordered w-full rounded-lg px-4 py-3 text-base bg-white border-gray-300 focus:border-blue-500 focus:outline-none shadow"
            placeholder="Enter username"
          />
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold py-3"
          >
            Search
          </button>
        </form>
        {searchQuery && (
          <div className="bg-white mt-4 text-gray-600 text-sm py-2">
            Showing {users.length} result{users.length !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-gray-800">"{searchQuery}"</span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <UserAccordionList />
        {loading && <LoadingSpinner />}
        {!loading && hasMore && users.length > 0 && (
          <div ref={loaderRef} className="flex justify-center py-4 opacity-60">
            <span>Loading more...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
