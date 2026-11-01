import { useState } from 'react';
import { api } from '../utils/api';
import {
  Shield, Lock, Unlock, AlertTriangle, CheckCircle, Eye, EyeOff,
  Play, Loader, ShieldAlert, ShieldCheck, Info
} from 'lucide-react';

export default function SecurityDemo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHashes, setShowHashes] = useState({});

  const runDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.runSecurityDemo();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleHash = (index) => {
    setShowHashes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">Security Demonstration</h1>
              <p className="text-sm text-surface-500">Password hashing comparison (developer-only)</p>
            </div>
          </div>
        </div>

        {/* Warning banner */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-fade-in delay-100">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Educational Demo Only</p>
            <p className="text-sm text-amber-700 mt-0.5">
              This demonstration uses only <strong>synthetic test data</strong>. No real user passwords are
              stored or transmitted in plaintext. Never store real passwords in plaintext. Do not enter
              credentials from third-party services.
            </p>
          </div>
        </div>

        {/* Run button */}
        {!data && (
          <div className="mt-8 text-center animate-fade-in delay-200">
            <button
              onClick={runDemo}
              disabled={loading}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" /> Running Demo...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Run Security Demo
                </>
              )}
            </button>
            {error && (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            )}
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="mt-8 space-y-6 animate-slide-up">
            {/* Explanation cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Plaintext risks */}
              <div className="bg-white rounded-2xl border border-red-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-base font-semibold text-red-800">Plaintext Storage Risks</h3>
                </div>
                <ul className="space-y-2.5">
                  {data.explanation.plaintextRisk.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <Unlock className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Argon2 benefits */}
              <div className="bg-white rounded-2xl border border-green-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-green-800">Argon2 Benefits</h3>
                </div>
                <ul className="space-y-2.5">
                  {data.explanation.argon2Benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <Lock className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-200 bg-surface-50">
                <h3 className="text-base font-semibold text-surface-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-surface-400" />
                  Side-by-Side Comparison (Synthetic Data)
                </h3>
              </div>
              <div className="divide-y divide-surface-100">
                {data.comparisons.map((c, i) => (
                  <div key={i} className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                        Synthetic Password #{i + 1}
                      </span>
                      <span className="px-2 py-0.5 bg-surface-100 rounded text-xs font-mono text-surface-600">
                        {c.syntheticPassword}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Plaintext */}
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Unlock className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-semibold text-red-700 uppercase">Plaintext Storage</span>
                        </div>
                        <code className="block text-sm font-mono text-red-800 break-all bg-red-100/50 px-3 py-2 rounded-lg">
                          {c.syntheticPassword}
                        </code>
                        <p className="text-xs text-red-600 mt-2">
                          ❌ Visible to anyone with database access
                        </p>
                      </div>

                      {/* Argon2 */}
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-semibold text-green-700 uppercase">Argon2 Hash</span>
                          </div>
                          <button
                            onClick={() => toggleHash(i)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                          >
                            {showHashes[i] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <code className="block text-xs font-mono text-green-800 break-all bg-green-100/50 px-3 py-2 rounded-lg max-h-20 overflow-auto">
                          {showHashes[i]
                            ? c.argon2Storage.replace(/^"|".*?[✅❌]$/g, '').split('" —')[0].replace(/^"/, '')
                            : '•'.repeat(40)}
                        </code>
                        <div className="flex items-center gap-1.5 mt-2">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          <p className="text-xs text-green-600">
                            ✅ Unreadable, salted, and secure
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs text-blue-700">
                        Verification: Argon2 correctly verifies the original password → <strong>{c.verificationWorks ? 'PASS' : 'FAIL'}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="flex items-start gap-3 p-5 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-primary-900">Recommendation</p>
                <p className="text-sm text-primary-700 mt-1">{data.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
