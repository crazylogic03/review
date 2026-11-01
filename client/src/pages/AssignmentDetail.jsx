import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  Star, Github, ExternalLink, Calendar, User, MessageSquare,
  AlertCircle, CheckCircle, Send, ArrowLeft
} from 'lucide-react';

function StarRating({ value, onChange, label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= value ? 'text-amber-500 fill-amber-500' : 'text-surface-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  const avg = ((review.designRating + review.functionalityRating + review.codeQualityRating) / 3).toFixed(1);
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
            {review.reviewer?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900">{review.reviewer?.name}</p>
            <p className="text-xs text-surface-400">
              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-semibold text-amber-700">{avg}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Design', value: review.designRating },
          { label: 'Functionality', value: review.functionalityRating },
          { label: 'Code Quality', value: review.codeQualityRating },
        ].map(({ label, value }) => (
          <div key={label} className="text-center p-2 bg-surface-50 rounded-lg">
            <p className="text-xs text-surface-500 mb-0.5">{label}</p>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-3 h-3 ${s <= value ? 'text-amber-500 fill-amber-500' : 'text-surface-300'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-surface-700 leading-relaxed">{review.feedback}</p>
    </div>
  );
}

export default function AssignmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    designRating: 0,
    functionalityRating: 0,
    codeQualityRating: 0,
    feedback: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    api.getAssignment(id).then(setAssignment).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const isOwner = assignment?.userId === user?.id;
  const hasReviewed = assignment?.reviews?.some((r) => r.reviewer?.id === user?.id);
  const canReview = !isOwner && !hasReviewed && !reviewSuccess;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (reviewForm.designRating === 0 || reviewForm.functionalityRating === 0 || reviewForm.codeQualityRating === 0) {
      return setReviewError('Please rate all categories');
    }
    setSubmitting(true);
    try {
      const review = await api.createReview({ assignmentId: id, ...reviewForm });
      setAssignment((prev) => ({ ...prev, reviews: [review, ...prev.reviews] }));
      setReviewSuccess(true);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-6 w-20 mb-6" />
          <div className="skeleton h-64 rounded-2xl mb-6" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <p className="text-surface-500">Assignment not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/assignments" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to assignments
        </Link>

        {/* Assignment details */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden mb-8 animate-fade-in">
          <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                {assignment.subject}
              </span>
              <div className="flex items-center gap-1 text-xs text-surface-400">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(assignment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-surface-900 mb-4">{assignment.title}</h1>
            <p className="text-surface-600 leading-relaxed mb-6 whitespace-pre-wrap">{assignment.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              {assignment.githubUrl && (
                <a
                  href={assignment.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-700 bg-surface-100 rounded-xl hover:bg-surface-200 transition-colors"
                >
                  <Github className="w-4 h-4" /> View Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-surface-100">
              <Link to={`/profile/${assignment.user?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-semibold">
                  {assignment.user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900">{assignment.user?.name}</p>
                  {assignment.user?.bio && <p className="text-xs text-surface-500 line-clamp-1">{assignment.user.bio}</p>}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Review form */}
        {canReview && (
          <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 mb-8 animate-fade-in delay-100">
            <h2 className="text-lg font-semibold text-surface-900 mb-1">Write a Review</h2>
            <p className="text-sm text-surface-500 mb-6">Rate this project and provide constructive feedback.</p>

            {reviewError && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" /> {reviewError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-4">
                <StarRating label="Design" value={reviewForm.designRating} onChange={(v) => setReviewForm({ ...reviewForm, designRating: v })} />
                <StarRating label="Functionality" value={reviewForm.functionalityRating} onChange={(v) => setReviewForm({ ...reviewForm, functionalityRating: v })} />
                <StarRating label="Code Quality" value={reviewForm.codeQualityRating} onChange={(v) => setReviewForm({ ...reviewForm, codeQualityRating: v })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Written Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                  placeholder="What did you like? What could be improved? Be specific and constructive..."
                  className="w-full px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {reviewSuccess && (
          <div className="flex items-center gap-2 p-4 mb-8 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 animate-fade-in">
            <CheckCircle className="w-5 h-5 shrink-0" /> Your review has been submitted successfully!
          </div>
        )}

        {isOwner && (
          <div className="flex items-center gap-2 p-4 mb-8 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 animate-fade-in">
            <User className="w-4 h-4 shrink-0" /> This is your assignment. You'll see reviews from peers below.
          </div>
        )}

        {hasReviewed && !reviewSuccess && (
          <div className="flex items-center gap-2 p-4 mb-8 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" /> You've already reviewed this assignment.
          </div>
        )}

        {/* Reviews list */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-surface-400" />
            <h2 className="text-lg font-semibold text-surface-900">
              Reviews ({assignment.reviews?.length || 0})
            </h2>
          </div>

          {assignment.reviews?.length > 0 ? (
            <div className="space-y-4">
              {assignment.reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-surface-200">
              <MessageSquare className="w-10 h-10 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-500 text-sm">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
