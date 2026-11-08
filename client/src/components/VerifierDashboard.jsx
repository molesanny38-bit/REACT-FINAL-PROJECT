import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  LockIcon, 
  QrCodeIcon, 
  SearchIcon, 
  AlertCircleIcon, 
  BuildingIcon, 
  PackageIcon,
  XIcon
} from './Icons';

export function VerifierDashboard({ 
  currentUser, 
  items, 
  claims, 
  onApproveClaim, 
  onRejectClaim, 
  onConfirmHandover 
}) {
  const isInstructor = currentUser.role === 'instructor';
  const isOfficer = currentUser.role === 'officer';
  const isDeptOffice = currentUser.role === 'dept_office';

  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'scanner' | 'inventory'
  const [pinInput, setPinInput] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  const pendingClaims = claims.filter(c => c.status === 'submitted');
  const custodyItems = items.filter(i => i.status !== 'resolved');

  // Verify PIN
  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    const code = pinInput.trim().toUpperCase();
    const foundClaim = claims.find(c => c.claimCode.toUpperCase() === code);

    if (foundClaim) {
      const associatedItem = items.find(i => i.id === foundClaim.itemId);
      setLookupResult({ claim: foundClaim, item: associatedItem });
    } else {
      setLookupResult({ error: `No claim found matching PIN "${code}".` });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Verifier Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-300" />
            <span>IT Department Official Verification Console</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser.name}
            </h1>
            <span className="self-start sm:self-auto text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/40 text-emerald-200">
              {currentUser.designation || 'Department Verifier'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
            Authorized Station: <strong className="text-white">{currentUser.station || 'Department Office & LAB 42–45'}</strong> • Department: <strong className="text-white">IT Department</strong>
          </p>

          <p className="mt-2 text-[11px] text-emerald-200">
            Authorized to compare student ownership proofs, review items found in LAB 42–45 & Rooms 46–49, and verify physical handover.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 max-w-lg">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Pending Claims</span>
              <span className="text-2xl font-black text-amber-300">{pendingClaims.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Secured in Department</span>
              <span className="text-2xl font-black text-white">{custodyItems.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs col-span-2 sm:col-span-1">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Coverage</span>
              <span className="text-sm font-black text-emerald-200 mt-1 block">LAB 42–45 & Room 46–49</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'claims'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Claim Verification Queue</span>
          {pendingClaims.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {pendingClaims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'scanner'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <QrCodeIcon className="w-4 h-4" />
          <span>Handover Code Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'border-emerald-600 text-emerald-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <PackageIcon className="w-4 h-4" />
          <span>Department Inventory ({custodyItems.length})</span>
        </button>
      </div>

      {/* TAB 1: CLAIMS VERIFICATION QUEUE */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {pendingClaims.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <CheckCircleIcon className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">All Claims Verified!</h3>
              <p className="text-xs text-slate-500 mt-1">No pending student claims waiting for verification.</p>
            </div>
          ) : (
            pendingClaims.map(claim => {
              const matchedItem = items.find(i => i.id === claim.itemId);

              return (
                <div 
                  key={claim.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                          Pending Verification
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          PIN: {claim.claimCode}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          📍 Found in: {claim.itemRoom}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 mt-1">
                        Claim for: {claim.itemTitle}
                      </h3>

                      <div className="text-xs text-slate-500 mt-0.5">
                        Claimant Student: <strong className="text-slate-800">{claim.claimantName}</strong> ({claim.claimantEmail}) • ID: <strong className="text-slate-800 font-mono">{claim.claimantStudentId}</strong> • Section: <strong className="text-indigo-600">{claim.yearSection || 'BSIT 3-A'}</strong>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onRejectClaim(claim.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                      >
                        Decline Claim
                      </button>

                      <button
                        onClick={() => onApproveClaim(claim.id)}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Verify & Approve Pickup</span>
                      </button>
                    </div>
                  </div>

                  {/* Side-by-side Proof Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                    {/* Student Proof */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <span>📝 Student's Submitted Proof:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">
                        "{claim.proofDescription}"
                      </p>
                    </div>

                    {/* Confidential Intake Note */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                        <LockIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Confidential Intake Secret Detail:</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-mono">
                        {matchedItem?.privateDetail || 'No secret detail recorded during intake.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-slate-400">
                    Holding spot: <strong>{claim.holdingLocation}</strong>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: HANDOVER CODE TERMINAL */}
      {activeTab === 'scanner' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <QrCodeIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Student Handover Terminal</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ask the student for their verification PIN (e.g. <strong>FIT-4201</strong>) to release the object.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="flex gap-2 mb-6">
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (e.g. FIT-4201)"
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 font-mono font-bold uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <SearchIcon className="w-4 h-4" />
              <span>Verify Code</span>
            </button>
          </form>

          {/* Lookup Result */}
          {lookupResult && (
            <div className="animate-in fade-in duration-200">
              {lookupResult.error ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{lookupResult.error}</span>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="font-bold text-slate-800 text-sm">Pass Verified ✅</span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {lookupResult.claim.claimCode}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600">
                    <div><strong>Object:</strong> {lookupResult.claim.itemTitle}</div>
                    <div><strong>Origin Room:</strong> {lookupResult.claim.itemRoom}</div>
                    <div><strong>Claimant:</strong> {lookupResult.claim.claimantName} ({lookupResult.claim.claimantEmail})</div>
                    <div><strong>Student ID:</strong> {lookupResult.claim.claimantStudentId}</div>
                    <div><strong>Year & Section:</strong> {lookupResult.claim.yearSection}</div>
                  </div>

                  <button
                    onClick={() => {
                      onConfirmHandover(lookupResult.claim.id, lookupResult.item?.id);
                      setLookupResult(null);
                      setPinInput('');
                    }}
                    className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Confirm Handover to Student (Mark Reunited)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DEPARTMENT INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Objects Secured in IT Department</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {custodyItems.length} active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Object</th>
                  <th className="py-3 px-4">Room Found</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Holding Location</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {custodyItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.title}</td>
                    <td className="py-3 px-4">📍 {item.room}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 text-slate-500">{item.holdingLocation}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.status === 'claim_pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.status === 'claim_pending' ? 'Claim Pending' : 'In Custody'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
