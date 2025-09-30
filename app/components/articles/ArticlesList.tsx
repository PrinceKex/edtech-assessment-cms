import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from '@remix-run/react';
import { useCallback, useMemo, useState } from 'react';
import { CategoryBadge, StatusBadge } from '~/components/ui/Badge';
import { Tab, Tabs } from '~/components/ui/Tabs';
import { formatDate, formatRelativeTime, getDueDateStatus } from '~/utils/date';

type ArticleStatus = 'draft' | 'published' | 'amendment' | 'upcoming' | 'active';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  status: ArticleStatus;
  category?: string | null;
  publishedAt?: string | null;
  updatedAt: string;
  isPublished: boolean;
  author?: {
    name?: string | null;
  };
}

interface ArticlesListProps {
  articles: Article[];
  onDelete?: (id: string) => void;
  className?: string;
}

export function ArticlesList({ articles, onDelete, className = '' }: ArticlesListProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'draft' | 'amendment' | 'active' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: 'asc' | 'desc';
  }>({
    key: 'updatedAt',
    direction: 'desc',
  });

  // Filter articles based on active tab and search query
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'draft' && article.status === 'draft') ||
        (activeTab === 'upcoming' && article.status === 'upcoming') ||
        (activeTab === 'amendment' && article.status === 'amendment') ||
        (activeTab === 'active' && article.status === 'published');
      
      return matchesSearch && matchesTab;
    });
  }, [articles, activeTab, searchQuery]);

  // Sort articles
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle undefined/null values
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredArticles, sortConfig]);

  const requestSort = useCallback((key: keyof Article) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Articles</h1>
        <Link
          to="/articles/new"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          New Article
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <Tabs>
          <Tab active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>
            Upcoming
          </Tab>
          <Tab active={activeTab === 'draft'} onClick={() => setActiveTab('draft')}>
            Draft
          </Tab>
          <Tab active={activeTab === 'amendment'} onClick={() => setActiveTab('amendment')}>
            Amendment
          </Tab>
          <Tab active={activeTab === 'active'} onClick={() => setActiveTab('active')}>
            Active
          </Tab>
          <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            All (Most Recent)
          </Tab>
        </Tabs>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          placeholder="Filter by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Articles Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {sortConfig?.key === 'title' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('publishedAt')}
              >
                <div className="flex items-center justify-center">
                  Published
                  {sortConfig?.key === 'publishedAt' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => requestSort('updatedAt')}
              >
                <div className="flex items-center">
                  Updated
                  {sortConfig?.key === 'updatedAt' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedArticles.length > 0 ? (
              sortedArticles.map((article) => {
                const dueDateStatus = article.publishedAt ? getDueDateStatus(article.publishedAt) : null;
                
                return (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                          {article.excerpt && (
                            <div className="text-sm text-gray-500 truncate max-w-md">
                              {article.excerpt}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {dueDateStatus ? (
                        <div className="flex items-center justify-center space-x-1">
                          {dueDateStatus.status === 'past' ? (
                            <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                          ) : dueDateStatus.status === 'upcoming' ? (
                            <ClockIcon className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          )}
                          <span className={`text-sm ${
                            dueDateStatus.status === 'past' 
                              ? 'text-red-600' 
                              : dueDateStatus.status === 'upcoming' 
                                ? 'text-yellow-600' 
                                : 'text-gray-600'
                          }`}>
                            {dueDateStatus.text}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not published</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{formatDate(article.updatedAt, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-xs text-gray-400">{formatRelativeTime(article.updatedAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {article.category ? (
                        <CategoryBadge category={article.category} />
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/articles/${article.id}/edit`}
                          className="text-teal-600 hover:text-teal-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete && onDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No articles found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">20</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Previous</span>
                <span className="h-5 w-5" aria-hidden="true">«</span>
              </button>
              {/* Current: "z-10 bg-teal-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"} */}
              <button
                aria-current="page"
                className="relative z-10 inline-flex items-center bg-teal-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                2
              </button>
              <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">
                3
              </button>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
              <button className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">
                8
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                9
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                10
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Next</span>
                <span className="h-5 w-5" aria-hidden="true">»</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
