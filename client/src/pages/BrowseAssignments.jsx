import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, Filter, Star, MessageSquare, Github, ExternalLink, User } from 'lucide-react';

function RatingBadge({ reviews }) {
  if (!reviews?.length) return <span className="text-xs text-surface-400">No reviews</span>;
  const avg = reviews.reduce((sum, r) => sum + (r.designRating + r.functionalityRating + r.codeQualityRating) / 3, 0) / reviews.length;
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
      <span className="text-sm font-semibold text-surface-800">{avg.toFixed(1)}</span>
      <span className="text-xs text-surface-400">({reviews.length})</span>
    </div>
  );
}

function SubjectBadge({ subject }) {
  const colors = {
    'Web Development': 'bg-blue-50 text-blue-700 border-blue-200',
    'Machine Learning': 'bg-purple-50 text-purple-700 border-purple-200',
    'Mobile Development': 'bg-green-50 text-green-700 border-green-200',
    'Systems Design': 'bg-orange-50 text-orange-700 border-orange-200',
    'UI/UX Design': 'bg-pink-50 text-pink-700 border-pink-200',
    'Data Science': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[subject] || 'bg-surface-50 text-surface-700 border-surface-200'}`}>
      {subject}
    </span>
  );
}

export default function BrowseAssignments() {
  const [data, setData] = useState({ assignments: [], total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSubjects().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (subject !== 'all') params.subject = subject;
    if (search) params.search = search;
    api.getAssignments(params).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [page, subject, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Browse Assignments</h1>
            <p className="text-surface-500 text-sm mt-1">{data.total} projects available for review</p>
          </div>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
          >
            Submit Yours
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in delay-100">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
          </form>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <select
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2.5 rounded-xl border border-surface-300 bg-white text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm appearance-none min-w-[180px]"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : data.assignments.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-surface-700 mb-1">No assignments found</h3>
            <p className="text-surface-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.assignments.map((a, i) => (
                <Link
                  key={a.id}
                  to={`/assignments/${a.id}`}
                  className="group bg-white rounded-2xl border border-surface-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Color bar */}
                  <div className="h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <SubjectBadge subject={a.subject} />
                      <RatingBadge reviews={a.reviews} />
                    </div>
                    <h3 className="text-base font-semibold text-surface-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-sm text-surface-500 line-clamp-2 mb-4">{a.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-semibold">
                          {a.user?.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-surface-600">{a.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-surface-400">
                        {a.githubUrl && <Github className="w-3.5 h-3.5" />}
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-xs">{a.reviews?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                      p === page ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-white text-surface-600 border border-surface-200 hover:border-primary-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
