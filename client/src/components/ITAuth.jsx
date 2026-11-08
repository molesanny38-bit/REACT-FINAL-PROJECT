import React, { useState } from 'react';
import { 
  SearchIcon, 
  ShieldCheckIcon, 
  LockIcon, 
  MailIcon, 
  UserIcon, 
  GraduationCapIcon, 
  BriefcaseIcon,
  AlertCircleIcon, 
  EyeIcon, 
  EyeOffIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  BuildingIcon, 
  CpuIcon 
} from './Icons';
import { authService } from '../services/api';

export function ITAuth({ onAuthSuccess }) {
  // Exactly 3 Role Choices: 'student' | 'verifier' | 'admin'
  const [activeRole, setActiveRole] = useState('student');
  
  // Student sub-tabs: 'login' | 'register'
  const [studentTab, setStudentTab] = useState('login');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Student State
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Student Registration State
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [program, setProgram] = useState('BS Information Technology (BSIT)');
  const [yearSection, setYearSection] = useState('BSIT 3-A');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToHonorCode, setAgreedToHonorCode] = useState(false);

  // 2. Department Verifier State (Instructor, Student Officer, Dept Head, Secretary)
  const [verifierIdentifier, setVerifierIdentifier] = useState('');
  const [verifierPassword, setVerifierPassword] = useState('');
  const [verifierDesignation, setVerifierDesignation] = useState('Instructor (Faculty)');
  const [verifierStation, setVerifierStation] = useState('Department Office & LAB 42–45');

  // 3. Admin State
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Quick Autofill Helpers for 1-click testing
  const handleAutofill = (type) => {
    setError('');
    if (activeRole === 'student') {
      if (studentTab === 'login') {
        setStudentIdentifier('s.chen@student.it.edu');
        setStudentPassword('StudentPass2026!');
      } else {
        setFullName('Sophia Chen');
        setStudentId('2024-4412');
        setStudentEmail('s.chen@student.it.edu');
        setProgram('BS Information Technology (BSIT)');
        setYearSection('BSIT 3-A');
        setRegPassword('StudentPass2026!');
        setConfirmPassword('StudentPass2026!');
        setAgreedToHonorCode(true);
      }
    } else if (activeRole === 'verifier') {
      if (type === 'officer' || verifierDesignation.includes('Officer')) {
        setVerifierIdentifier('c.reyes@student.it.edu');
        setVerifierPassword('OfficerPass2026!');
        setVerifierDesignation('Student Officer (IT Society / Council)');
        setVerifierStation('Department Office & LAB 44');
      } else if (type === 'office' || verifierDesignation.includes('Head') || verifierDesignation.includes('Secretary')) {
        setVerifierIdentifier('secretary@it.campus.edu');
        setVerifierPassword('OfficePass2026!');
        setVerifierDesignation('Department Head / Secretary');
        setVerifierStation('IT Department Main Office');
      } else {
        // Default Instructor
        setVerifierIdentifier('m.davis@it.campus.edu');
        setVerifierPassword('InstructorPass2026!');
        setVerifierDesignation('Instructor (Faculty)');
        setVerifierStation('Department Office & LAB 42–43');
      }
    } else if (activeRole === 'admin') {
      setAdminIdentifier('admin@it.campus.edu');
      setAdminPassword('MasterAdmin2026!');
    }
  };

  // Student Sign In Submit
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!studentIdentifier || !studentPassword) {
      setError('Please provide student email or ID number and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(studentIdentifier, studentPassword, 'student');
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Student Registration Submit
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName || !studentId || !studentEmail || !regPassword) {
      setError('Please complete all registration fields.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreedToHonorCode) {
      setError('You must agree to the Department Honor Code.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.registerStudent({
        fullName,
        studentId,
        email: studentEmail,
        password: regPassword,
        program,
        yearSection
      });
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Unified Department Verifier Submit (Instructor, Student Officer, Dept Head, Secretary)
  const handleVerifierLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!verifierIdentifier || !verifierPassword) {
      setError('Please provide your Verifier Email/ID and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(verifierIdentifier, verifierPassword, 'verifier', {
        designation: verifierDesignation,
        station: verifierStation
      });
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Verifier authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Admin Submit
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!adminIdentifier || !adminPassword) {
      setError('Please enter Admin Email and master password.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(adminIdentifier, adminPassword, 'admin');
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || 'Administrator authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className={`absolute top-0 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        activeRole === 'student' ? 'bg-indigo-300/30' : 
        activeRole === 'verifier' ? 'bg-emerald-300/30' : 'bg-purple-300/30'
      }`}></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-lg mb-3 transition-colors duration-300 ${
            activeRole === 'student' ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-indigo-200' :
            activeRole === 'verifier' ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 shadow-emerald-200' :
            'bg-gradient-to-tr from-purple-800 to-slate-900 shadow-purple-200'
          }`}>
            <CpuIcon className="w-7 h-7" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Find<span className={
                activeRole === 'verifier' ? 'text-emerald-600' : 
                activeRole === 'admin' ? 'text-purple-600' : 'text-indigo-600'
              }>It</span>
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              IT Department
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Lost & Found System for LAB 42–45, Room 46–49 & Department Office
          </p>
        </div>

        {/* Outer Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          
          {/* ========================================================= */}
          {/* EXACTLY 3 CHOICES IN ROLE TAB SELECTOR                    */}
          {/* ========================================================= */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center">
            
            {/* 1. Student Choice */}
            <button
              onClick={() => { setActiveRole('student'); setError(''); }}
              className={`py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>🎓 Student</span>
            </button>

            {/* 2. Department Verifier Choice (Instructor, Student Officer, Dept Head, Secretary) */}
            <button
              onClick={() => { setActiveRole('verifier'); setError(''); }}
              className={`py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'verifier'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Instructors, Student Officers, Department Head & Secretary"
            >
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Department Verifier</span>
            </button>

            {/* 3. Admin Choice */}
            <button
              onClick={() => { setActiveRole('admin'); setError(''); }}
              className={`py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'admin'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>⚡ Admin</span>
            </button>
          </div>

          {/* Sub-tab for Students (Sign In vs Register) */}
          {activeRole === 'student' && (
            <div className="grid grid-cols-2 p-1 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-center">
              <button
                onClick={() => { setStudentTab('login'); setError(''); }}
                className={`py-2 rounded-xl transition-all ${
                  studentTab === 'login'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Student Sign In
              </button>
              <button
                onClick={() => { setStudentTab('register'); setError(''); }}
                className={`py-2 rounded-xl transition-all ${
                  studentTab === 'register'
                    ? 'bg-white text-indigo-700 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Student Account
              </button>
            </div>
          )}

          <div className="p-6 sm:p-8">
            
            {/* Quick Demo Autofill Pill */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                Quick Test?
              </span>

              {activeRole === 'verifier' ? (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <span className="text-slate-400 font-normal">Auto-fill:</span>
                  <button type="button" onClick={() => handleAutofill('instructor')} className="hover:underline">
                    Instructor
                  </button>
                  <span>•</span>
                  <button type="button" onClick={() => handleAutofill('officer')} className="hover:underline">
                    Student Officer
                  </button>
                  <span>•</span>
                  <button type="button" onClick={() => handleAutofill('office')} className="hover:underline">
                    Secretary
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAutofill()}
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  Auto-fill {activeRole === 'student' ? 'Student' : 'Admin'} Demo
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* CHOICE 1: STUDENT LOGIN & REGISTRATION                   */}
            {/* ========================================================= */}
            {activeRole === 'student' && studentTab === 'login' && (
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Student ID or Department Email *
                  </label>
                  <div className="relative">
                    <GraduationCapIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      placeholder="e.g. 2024-4412 or s.chen@student.it.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Password *</label>
                    <a href="#help" onClick={(e) => { e.preventDefault(); alert("Contact IT Department Office (Secretary) to reset password."); }} className="text-[11px] text-indigo-600 hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <LockIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
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
                    <span>Remember this student device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <span>Authenticating Student...</span> : <><span>Sign In to Student Portal</span><ArrowRightIcon className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* Student Registration Form */}
            {activeRole === 'student' && studentTab === 'register' && (
              <form onSubmit={handleStudentRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sophia Chen"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Student ID *</label>
                    <div className="relative">
                      <GraduationCapIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="2024-4412"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department Email *</label>
                    <div className="relative">
                      <MailIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="s.chen@student.it.edu"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year & Section *</label>
                    <input
                      type="text"
                      required
                      value={yearSection}
                      onChange={(e) => setYearSection(e.target.value)}
                      placeholder="e.g. BSIT 3-A"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree Program</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="BS Information Technology (BSIT)">BS Information Technology (BSIT)</option>
                    <option value="BS Computer Science (BSCS)">BS Computer Science (BSCS)</option>
                    <option value="BS Information Systems (BSIS)">BS Information Systems (BSIS)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <div className="relative">
                      <LockIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min 6 chars"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <LockIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter"
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
                      I am an active IT Department student. I understand that false claims in LAB 42–45 or Rooms 46–49 violate the Department Honor Code.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreedToHonorCode}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:bg-indigo-300 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <span>Registering IT Student...</span> : <><span>Complete IT Registration</span><CheckCircleIcon className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* CHOICE 2: DEPARTMENT VERIFIER LOGIN FORM                  */}
            {/* (Single unified login intended for Instructors, Student   */}
            {/*  Officers, Department Head & Secretary)                   */}
            {/* ========================================================= */}
            {activeRole === 'verifier' && (
              <form onSubmit={handleVerifierLogin} className="space-y-4 animate-in fade-in duration-200">
                
                {/* Information Header Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2.5">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Department Verifier Access</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Unified verification portal intended for <strong>Instructors</strong>, <strong>Student Officers</strong>, <strong>Department Head</strong>, and the <strong>Secretary</strong> to verify ownership proofs and release lost objects.
                    </p>
                  </div>
                </div>

                {/* Verifier Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Your Verifier Role / Position *
                  </label>
                  <select
                    value={verifierDesignation}
                    onChange={(e) => setVerifierDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Instructor (Faculty)">👨‍🏫 Instructor (Faculty Member)</option>
                    <option value="Student Officer (IT Society / Council)">⭐ Student Officer (IT Society / Council)</option>
                    <option value="Department Head / Secretary">🏢 Department Head / Secretary (Dept Office)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Verifier Email or Employee/Officer ID *
                  </label>
                  <div className="relative">
                    <MailIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={verifierIdentifier}
                      onChange={(e) => setVerifierIdentifier(e.target.value)}
                      placeholder="e.g. m.davis@it.campus.edu or c.reyes@student.it.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Primary Station / Lab Coverage *
                  </label>
                  <select
                    value={verifierStation}
                    onChange={(e) => setVerifierStation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Department Office & LAB 42–45">Department Office & LAB 42–45</option>
                    <option value="LAB 42 & LAB 43">LAB 42 & LAB 43 (Computer Labs)</option>
                    <option value="LAB 44 & LAB 45">LAB 44 & LAB 45 (Multimedia & Capstone)</option>
                    <option value="Rooms 46–49">Rooms 46–49 (Lecture Halls)</option>
                    <option value="IT Department Main Office">IT Department Main Office (Safe Cabinet)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Security Password *
                  </label>
                  <div className="relative">
                    <LockIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={verifierPassword}
                      onChange={(e) => setVerifierPassword(e.target.value)}
                      placeholder="Enter security password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-emerald-300 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Department Verification Console</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ========================================================= */}
            {/* CHOICE 3: ADMIN LOGIN FORM                                */}
            {/* ========================================================= */}
            {activeRole === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
                  <BuildingIcon className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">IT Department System Administration</span>
                    <p className="text-[11px] text-purple-800 mt-0.5 leading-relaxed">
                      System administrator access for audit logs, managing room facilities (LAB 42–45, Rooms 46–49), and retention policies.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Administrator Email *
                  </label>
                  <div className="relative">
                    <MailIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="admin@it.campus.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Master Administrator Password *
                  </label>
                  <div className="relative">
                    <LockIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 active:scale-95 disabled:bg-purple-300 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Verifying Admin Privileges...</span>
                  ) : (
                    <>
                      <span>Open Administrator Control Center</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Footer Notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400 justify-center">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>IT Department Security & Custody Gateway</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
