import React, { useState } from 'react';
import { 
  SearchIcon, 
  ShieldCheckIcon, 
  LockIcon, 
  MailIcon, 
  UserIcon, 
  GraduationCapIcon, 
  AlertCircleIcon, 
  EyeIcon, 
  EyeOffIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from './Icons';
import { authService } from '../services/api';

export function StudentAuth({ onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('Bachelor of Science in Information Technology');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToHonorCode, setAgreedToHonorCode] = useState(false);

  // Fill quick demo credentials
  const fillDemoStudent = () => {
    if (tab === 'login') {
      setLoginIdentifier('s.chen@campus.edu');
      setLoginPassword('CampusStudent2026!');
    } else {
      setFullName('Sophia Chen');
      setStudentId('2026-4412');
      setEmail('s.chen@campus.edu');
      setMajor('BSIT');
      setRegPassword('CampusStudent2026!');
      setConfirmPassword('CampusStudent2026!');
      setAgreedToHonorCode(true);
    }
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginIdentifier || !loginPassword) {
      setError('Please provide your campus email/ID and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(loginIdentifier, loginPassword);
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !studentId || !email || !regPassword) {
      setError('Please fill in all required campus credentials.');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    if (!agreedToHonorCode) {
      setError('You must agree to the Campus Honor Code to proceed.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register({
        fullName,
        studentId,
        email,
        password: regPassword,
        major
      });
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Brand Card Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200 mb-3">
            <SearchIcon className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Find<span className="text-indigo-600">It</span>
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
              Campus Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lost and Found Coordination for Students & Campus Staff
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`py-3 rounded-2xl transition-all ${
                tab === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Student Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`py-3 rounded-2xl transition-all ${
                tab === 'register'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              New Student Registration
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Quick Demo Autofill Pill */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                
              </span>
              <button
                type="button"
                onClick={fillDemoStudent}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Auto-fill Student Demo Credentials
              </button>
            </div>

            {/* Error Message Banner */}
            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Campus Email or Student ID
                  </label>
                  <div className="relative">
                    <MailIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. s.chen@campus.edu or 2026-4412"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <a href="#help" onClick={(e) => { e.preventDefault(); alert("Please visit your Campus IT Security Desk to reset university single sign-on credentials."); }} className="text-[11px] text-indigo-600 hover:underline">
                      Forgot credentials?
                    </a>
                  </div>
                  <div className="relative">
                    <LockIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter student password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Verifying Student Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Student Portal</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* TAB 2: REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jordan Miller"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student ID Number *
                    </label>
                    <div className="relative">
                      <GraduationCapIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="2026-9921"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Email *
                    </label>
                    <div className="relative">
                      <MailIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="j.miller@campus.edu"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department / Major
                    </label>
                    <select
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Bachelor of Science in Industrial Technology">Bachelor of Science in Industrial Technology</option>
                      <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
                      <option value="Bachelor of Technology and Livelihood Education">Bachelor of Technology and Livelihood Education</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <LockIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOffIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <LockIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOffIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campus Honor Code Checkbox */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <label className="flex items-start gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      required
                      checked={agreedToHonorCode}
                      onChange={(e) => setAgreedToHonorCode(e.target.checked)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      I certify that I am an actively enrolled university student. I understand that submitting false or fraudulent claims for lost property is a violation of the Campus Honor Code and will be referred to University Security.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreedToHonorCode}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Registering Student Account...</span>
                  ) : (
                    <>
                      <span>Complete Student Registration</span>
                      <CheckCircleIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Campus Security Notice at Bottom */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 justify-center">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Campus Security & Student Affairs Verified Gateway</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
