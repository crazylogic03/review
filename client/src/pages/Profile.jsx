import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  User, Mail, Phone, Calendar, FileText, Star, MessageSquare,
  Edit3, Save, X, BookOpen
} from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('assignments');

  const profileId = id || currentUser?.id;
  const isOwnProfile = profileId === currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, reviews] = await Promise.all([
          api.getUserProfile(profileId),
          isOwnProfile ? api.getReceivedReviews() : Promise.resolve([]),
        ]);
        setProfile(profileData);
        setReceivedReviews(reviews);
        setEditForm({ name: profileData.name, bio: profileData.bio || '', phone: '' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (profileId) fetchData();
  }, [profileId, isOwnProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile(editForm);
      setProfile((prev) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-48 rounded-2xl mb-6" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <p className="text-surface-500">Profile not found.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'assignments', label: 'Assignments', count: profile._count?.assignments || 0 },
    ...(isOwnProfile ? [{ id: 'reviews', label: 'Reviews Received', count: receivedReviews.length }] : []),
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden mb-6 animate-fade-in">
          <div className="h-28 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600" />
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 sm:pb-1">
                {editing ? (
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-xl font-bold text-surface-900 border-b-2 border-primary-500 focus:outline-none bg-transparent"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-surface-900">{profile.name}</h1>
                )}
                <p className="text-sm text-surface-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </p>
              </div>
              {isOwnProfile && !editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
              {editing && (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-surface-600 bg-surface-100 rounded-xl hover:bg-surface-200 transition-colors">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              {editing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={2}
                  placeholder="Write a short bio..."
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                />
              ) : (
                profile.bio && <p className="text-sm text-surface-600">{profile.bio}</p>
              )}
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-surface-100">
              <div className="flex items-center gap-1.5 text-sm text-surface-500">
                <FileText className="w-4 h-4" />
                <span className="font-semibold text-surface-900">{profile._count?.assignments || 0}</span> assignments
              </div>
              <div className="flex items-center gap-1.5 text-sm text-surface-500">
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold text-surface-900">{profile._count?.reviews || 0}</span> reviews given
              </div>
              <div className="flex items-center gap-1.5 text-sm text-surface-500">
                <Calendar className="w-4 h-4" />
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-surface-200 text-surface-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {profile.assignments?.length > 0 ? (
              profile.assignments.map((a) => {
                const avgRating = a.reviews?.length
                  ? (a.reviews.reduce((sum, r) => sum + (r.designRating + r.functionalityRating + r.codeQualityRating) / 3, 0) / a.reviews.length).toFixed(1)
                  : null;
                return (
                  <Link
                    key={a.id}
                    to={`/assignments/${a.id}`}
                    className="block bg-white rounded-2xl border border-surface-200 p-5 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{a.subject}</span>
                        <h3 className="text-base font-semibold text-surface-900 mt-2">{a.title}</h3>
                        <p className="text-sm text-surface-500 mt-1">
                          {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-surface-500">
                        {avgRating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-semibold text-surface-800">{avgRating}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {a.reviews?.length || 0}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-surface-200">
                <BookOpen className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 text-sm">No assignments submitted yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {receivedReviews.length > 0 ? (
              receivedReviews.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-surface-200 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link to={`/assignments/${r.assignment?.id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                        {r.assignment?.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-[10px] font-semibold">
                          {r.reviewer?.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-surface-500">{r.reviewer?.name} · {new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {((r.designRating + r.functionalityRating + r.codeQualityRating) / 3).toFixed(1)}
                    </div>
                  </div>
                  <p className="text-sm text-surface-700">{r.feedback}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-surface-200">
                <MessageSquare className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 text-sm">No reviews received yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
