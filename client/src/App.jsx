import React, { useState, useEffect } from 'react';
import { ITAuth } from './components/ITAuth';
import { StudentDashboard } from './components/StudentDashboard';
import { VerifierDashboard } from './components/VerifierDashboard';
import { ClaimModal } from './components/ClaimModal';
import { ReportModal } from './components/ReportModal';
import { authService } from './services/api';
import { INITIAL_IT_ITEMS, INITIAL_IT_CLAIMS } from './mockData/itDepartmentData';
import { SearchIcon, CpuIcon, ShieldCheckIcon } from './components/Icons';

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState(INITIAL_IT_ITEMS);
  const [claims, setClaims] = useState(INITIAL_IT_CLAIMS);

  // Modals
  const [claimTargetItem, setClaimTargetItem] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState('lost');
  const [toast, setToast] = useState(null);

  // Load existing session on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Add Item
  const handleAddItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    showToast(`Object successfully recorded in ${newItem.room}!`);
  };

  // Submit Claim
  const handleSubmitClaim = (newClaim) => {
    setClaims(prev => [newClaim, ...prev]);
    setItems(prev => prev.map(item => 
      item.id === newClaim.itemId ? { ...item, status: 'claim_pending' } : item
    ));
    showToast('Claim ticket created! Present PIN to Instructor or Student Officer.');
  };

  // Approve Claim
  const handleApproveClaim = (claimId) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'approved' } : c));
    showToast('Claim verified and approved for pickup!');
  };

  // Reject Claim
  const handleRejectClaim = (claimId) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'rejected' } : c));
    showToast('Claim declined.', 'error');
  };

  // Confirm Handover
  const handleConfirmHandover = (claimId, itemId) => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: 'collected' } : c));
    if (itemId) {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, status: 'resolved' } : i));
    }
    showToast('Object officially handed over to student! Reunited 🎉');
  };

  // If not logged in, display the IT Department Multi-Role Authentication Screen
  if (!currentUser) {
    return <ITAuth onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  const isStudent = currentUser.role === 'student';
  const isVerifier = currentUser.role === 'verifier' || currentUser.role === 'instructor' || currentUser.role === 'officer' || currentUser.role === 'dept_office';
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white border ${
            toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-slate-900 border-slate-700'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & Department Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <CpuIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    Find<span className="text-indigo-600">It</span>
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAdmin ? 'bg-purple-900 text-white' : 
                    isVerifier ? 'bg-emerald-800 text-white' : 
                    'bg-slate-900 text-white'
                  }`}>
                    {isAdmin ? 'Admin Console' : isVerifier ? 'Department Verifier' : 'IT Student'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  LAB 42–45 • Room 46–49 • Department Office
                </p>
              </div>
            </div>

            {/* User Session Profile & Role Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                <div className={`w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-xs ${
                  isAdmin ? 'bg-purple-700' : 
                  isVerifier ? 'bg-emerald-700' : 'bg-indigo-600'
                }`}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="font-bold text-slate-900 leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {isStudent && `${currentUser.yearSection || 'BSIT 3-A'}`}
                    {isVerifier && `${currentUser.designation || 'Department Verifier'}`}
                    {isAdmin && 'System Administrator'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                Sign Out / Switch Role
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content View (Student Dashboard vs Verifier Dashboard) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isStudent ? (
          /* Student Portal */
          <StudentDashboard
            currentUser={currentUser}
            items={items}
            claims={claims}
            onOpenReport={(type) => {
              setReportModalType(type);
              setReportModalOpen(true);
            }}
            onClaimItem={(item) => setClaimTargetItem(item)}
          />
        ) : (
          /* Department Verifier Console (Instructors, Student Officers, Dept Head & Secretary, Admin) */
          <VerifierDashboard
            currentUser={currentUser}
            items={items}
            claims={claims}
            onApproveClaim={handleApproveClaim}
            onRejectClaim={handleRejectClaim}
            onConfirmHandover={handleConfirmHandover}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>Find It • IT Department Lost & Found Management System (LAB 42, 43, 44, 45 & Rooms 46, 47, 48, 49)</p>
      </footer>

      {/* Modals */}
      <ClaimModal
        item={claimTargetItem}
        currentUser={currentUser}
        onClose={() => setClaimTargetItem(null)}
        onSubmitClaim={handleSubmitClaim}
      />

      <ReportModal
        isOpen={reportModalOpen}
        defaultType={reportModalType}
        currentUser={currentUser}
        onClose={() => setReportModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
}

export default App;
