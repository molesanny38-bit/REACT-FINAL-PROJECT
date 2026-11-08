import React, { useState, useEffect } from 'react';
import { StudentAuth } from './components/StudentAuth';
import { authService } from './services/api';
import { 
  SearchIcon, 
  ShieldCheckIcon, 
  UserIcon, 
  GraduationCapIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  AlertCircleIcon
} from './components/Icons';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'my-claims'

  // Load existing session on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // If student is not logged in, show the Student Login & Registration screen
  if (!currentUser) {
    return <StudentAuth onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <SearchIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    Find<span className="text-indigo-600">It</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Student Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Campus Lost & Found Management System</p>
              </div>
            </div>

            {/* Student Profile & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-slate-900 leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{currentUser.studentId}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Welcome Student Banner */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
              Authenticated Student Session
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Student ID: <strong className="text-white font-mono">{currentUser.studentId}</strong> • Campus Email: <strong className="text-white">{currentUser.email}</strong>
              {currentUser.major && ` • Department: ${currentUser.major}`}
            </p>
            <p className="mt-2 text-indigo-200 text-xs">
              Your student credentials enable you to report missing property, verify ownership of found articles, and coordinate secure desk pickup passes.
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg mb-3">
              🔍
            </div>
            <h3 className="font-bold text-slate-900 text-sm">I Lost Something</h3>
            <p className="text-xs text-slate-500 mt-1">
              File a lost item notice across campus buildings with secret identifying marks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-3">
              📦
            </div>
            <h3 className="font-bold text-slate-900 text-sm">I Found Something</h3>
            <p className="text-xs text-slate-500 mt-1">
              Log an item found on campus and locate the nearest designated intake desk.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-3">
              🎫
            </div>
            <h3 className="font-bold text-slate-900 text-sm">My Pickup Passes</h3>
            <p className="text-xs text-slate-500 mt-1">
              View your active claim tickets, status reviews, and pickup QR/PIN passes.
            </p>
          </div>
        </div>

        {/* Database & API Status Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-sm">Backend & Database Connection</h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Ready for MySQL / MongoDB
            </span>
          </div>

          <div className="mt-4 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              The authentication system is wired to send credentials to the Node.js / Express API at <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-600">/api/auth/login</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-600">/api/auth/register</code> with secure password hashing (<code className="font-mono">bcryptjs</code>) and JSON Web Tokens (<code className="font-mono">JWT</code>).
            </p>
            <p>
              Student record currently active: <span className="font-mono font-bold text-slate-800">{currentUser.name} ({currentUser.email})</span>.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>Find It • University Campus Lost & Found Coordination System</p>
      </footer>
    </div>
  );
}

export default App;
