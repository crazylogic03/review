import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { FileText, Github, BookOpen, Tag, AlignLeft, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

const subjects = [
  'Web Development', 'Machine Learning', 'Mobile Development', 'Systems Design',
  'UI/UX Design', 'Data Science', 'Cybersecurity', 'Cloud Computing', 'DevOps', 'Other',
];

export default function SubmitAssignment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', subject: '', description: '', githubUrl: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createAssignment(form);
      setSuccess(true);
      setTimeout(() => navigate('/assignments'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Assignment Submitted!</h2>
          <p className="text-surface-500">Redirecting to browse page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-surface-900 mb-1">Submit Assignment</h1>
          <p className="text-surface-500 mb-8">Share your project with classmates for peer review.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
                <FileText className="w-4 h-4 text-surface-400" /> Assignment Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="E-Commerce Dashboard with Real-Time Analytics"
                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
                <Tag className="w-4 h-4 text-surface-400" /> Subject / Category
              </label>
              <select
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
              >
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
                <AlignLeft className="w-4 h-4 text-surface-400" /> Description
              </label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your project, technologies used, features implemented, and what you'd like feedback on..."
                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              />
              <p className="text-xs text-surface-400 mt-1">{form.description.length} / 10 min characters</p>
            </div>

            {/* GitHub URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
                <Github className="w-4 h-4 text-surface-400" /> GitHub Repository URL
                <span className="text-surface-400">(optional)</span>
              </label>
              <input
                type="url"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                placeholder="https://github.com/username/project"
                className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Submission date */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-50 rounded-xl border border-surface-200">
              <Calendar className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-600">
                Submission date: <span className="font-medium text-surface-800">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </span>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Assignment'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 text-sm font-medium text-surface-600 bg-surface-100 rounded-xl hover:bg-surface-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
