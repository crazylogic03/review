import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  FileText, MessageSquare, Star, Clock, PlusCircle, FolderOpen,
  TrendingUp, Activity, ArrowRight
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div className={`bg-white rounded-2xl border border-surface-200 p-6 hover:shadow-lg hover:shadow-${color}-500/5 transition-all duration-300 hover:-translate-y-0.5 animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-${color}-50 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <TrendingUp className="w-4 h-4 text-green-500" />
      </div>
      <p className="text-3xl font-bold text-surface-900">{value}</p>
      <p className="text-sm text-surface-500 mt-1">{label}</p>
    </div>
  );
}

function ActivityItem({ activity }) {
  const icons = {
    assignment_submitted: FileText,
    review_submitted: MessageSquare,
    account_created: Star,
  };
  const colors = {
    assignment_submitted: 'primary',
    review_submitted: 'accent',
    account_created: 'green',
  };
  const Icon = icons[activity.type] || Activity;
  const color = colors[activity.type] || 'surface';

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 text-${color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-800 leading-snug">{activity.message}</p>
        <p className="text-xs text-surface-400 mt-0.5">{new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-primary-100 text-sm mt-0.5">Here's your activity overview</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard icon={FileText} label="Assignments Submitted" value={stats?.assignmentCount ?? 0} color="primary" delay={0} />
          <StatCard icon={Clock} label="Pending Reviews" value={stats?.pendingReviews ?? 0} color="amber" delay={100} />
          <StatCard icon={MessageSquare} label="Feedback Received" value={stats?.feedbackReceived ?? 0} color="accent" delay={200} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-surface-900">Quick Actions</h2>
            <Link
              to="/submit"
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shrink-0">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-surface-900">Submit Assignment</p>
                <p className="text-xs text-surface-500">Share your latest project</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/assignments"
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-500/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-surface-900">Browse Projects</p>
                <p className="text-xs text-surface-500">Review peers' work</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              to="/profile"
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-surface-900">View Profile</p>
                <p className="text-xs text-surface-500">Check your reviews</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-surface-900">Recent Activity</h2>
              <Activity className="w-5 h-5 text-surface-400" />
            </div>
            {stats?.recentActivity?.length > 0 ? (
              <div className="divide-y divide-surface-100">
                {stats.recentActivity.map((a) => (
                  <ActivityItem key={a.id} activity={a} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 text-sm">No activity yet. Start by submitting an assignment!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
