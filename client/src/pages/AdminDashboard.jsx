import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Users, FileText, MessageSquare, Activity, Shield, Trash2,
  TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, gradient }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <p className="text-3xl font-bold text-surface-900">{value}</p>
      <p className="text-sm text-surface-500 mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([api.getAdminStats(), api.getAdminUsers()])
      .then(([stats, userList]) => {
        setData(stats);
        setUsers(userList);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setData((prev) => ({
        ...prev,
        stats: { ...prev.stats, users: prev.stats.users - 1 },
      }));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-8 w-48 mb-8" />
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-900 to-surface-800 px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-surface-400 text-sm">Platform overview and user management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard icon={Users} label="Total Users" value={data?.stats?.users ?? 0} gradient="from-blue-500 to-blue-600" />
          <StatCard icon={FileText} label="Total Assignments" value={data?.stats?.assignments ?? 0} gradient="from-violet-500 to-purple-600" />
          <StatCard icon={MessageSquare} label="Total Reviews" value={data?.stats?.reviews ?? 0} gradient="from-amber-500 to-orange-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-100 rounded-xl p-1 max-w-md">
          {[
            { id: 'overview', label: 'Recent Activity' },
            { id: 'users', label: 'User Management' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Activity tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-surface-200 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-surface-400" /> Recent Platform Activity
            </h2>
            {data?.recentActivity?.length > 0 ? (
              <div className="divide-y divide-surface-100">
                {data.recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                      {a.user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-800">
                        <span className="font-semibold">{a.user?.name}</span>{' '}
                        <span className="text-surface-500">{a.message}</span>
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {new Date(a.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      a.type === 'assignment_submitted' ? 'bg-blue-50 text-blue-700' :
                      a.type === 'review_submitted' ? 'bg-purple-50 text-purple-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {a.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-500 py-8 text-center">No recent activity.</p>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Assignments</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Reviews</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
                            {u.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-surface-900">{u.name}</p>
                            <p className="text-xs text-surface-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          u.role === 'ADMIN' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-surface-700">{u._count?.assignments ?? 0}</td>
                      <td className="px-6 py-4 text-center text-sm text-surface-700">{u._count?.reviews ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-surface-500">
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'ADMIN' && (
                          deleteConfirm === u.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs px-3 py-1.5 bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(u.id)}
                              className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
