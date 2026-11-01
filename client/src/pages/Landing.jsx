import { Link } from 'react-router-dom';
import {
  BookOpen, ArrowRight, Star, MessageSquare, Users, CheckCircle,
  Sparkles, Shield, Zap, BarChart3, Upload, GitBranch
} from 'lucide-react';

const features = [
  { icon: Upload, title: 'Submit Assignments', description: 'Share your projects with GitHub links, descriptions, and file uploads for peer evaluation.' },
  { icon: MessageSquare, title: 'Structured Feedback', description: 'Receive detailed reviews on design, functionality, and code quality from your peers.' },
  { icon: BarChart3, title: 'Track Progress', description: 'Monitor your submissions, reviews received, and growth with a personal dashboard.' },
  { icon: Users, title: 'Peer Community', description: 'Connect with classmates, discover projects, and learn from diverse coding styles.' },
  { icon: Shield, title: 'Secure Platform', description: 'Industry-standard Argon2 password hashing and JWT authentication keep your data safe.' },
  { icon: GitBranch, title: 'GitHub Integration', description: 'Link your repository directly so reviewers can explore your code and architecture.' },
];

const steps = [
  { num: '01', title: 'Create Your Account', description: 'Sign up in seconds with just your email and a password.' },
  { num: '02', title: 'Submit an Assignment', description: 'Add your project details, GitHub URL, and any supporting files.' },
  { num: '03', title: 'Review Peers\' Work', description: 'Browse submissions and provide ratings and constructive feedback.' },
  { num: '04', title: 'Grow Together', description: 'Use feedback to improve your projects and coding skills.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-surface-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">Peer<span className="text-primary-600">Review</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-surface-900 transition-colors">Sign in</Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-32 lg:pb-36">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Built for students, by students
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-surface-900 leading-[1.1]">
              Better Feedback.{' '}
              <span className="gradient-text">Better Projects.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-surface-600 leading-relaxed max-w-2xl mx-auto">
              Submit your assignments, share project links, and receive structured peer reviews from your classmates. Improve together through thoughtful, constructive feedback.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-surface-700 bg-white border border-surface-300 rounded-2xl hover:border-surface-400 hover:shadow-md transition-all duration-300"
              >
                Explore Projects
              </Link>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-surface-500 animate-fade-in delay-300">
            {[
              { icon: Users, label: '500+ Students' },
              { icon: Star, label: '2,000+ Reviews' },
              { icon: CheckCircle, label: '1,200+ Submissions' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium">
                <Icon className="w-4 h-4 text-primary-500" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">Everything you need for peer reviews</h2>
            <p className="mt-4 text-lg text-surface-600">A complete platform for submitting, reviewing, and improving your academic projects.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group relative p-6 bg-white rounded-2xl border border-surface-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">How it works</h2>
            <p className="mt-4 text-lg text-surface-600">Get started in four simple steps.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ num, title, description }, i) => (
              <div key={num} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 text-white text-xl font-bold mb-5 shadow-lg shadow-primary-500/20">
                  {num}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-300 to-transparent" />
                )}
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-surface-900 to-surface-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4" /> Start improving today
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to level up your projects?</h2>
          <p className="text-lg text-surface-400 mb-10">Join your classmates on PeerReview and start giving and receiving meaningful feedback.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-surface-900 bg-white rounded-2xl hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:-translate-y-0.5"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-semibold text-surface-900">PeerReview</span>
          </div>
          <p className="text-sm text-surface-500">© 2024 PeerReview. A demo project for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
