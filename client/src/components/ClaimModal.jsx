import React, { useState } from 'react';
import { XIcon, ShieldCheckIcon, QrCodeIcon, CheckCircleIcon, LockIcon } from './Icons';

export function ClaimModal({ item, currentUser, onClose, onSubmitClaim }) {
  const [proof, setProof] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [generatedPass, setGeneratedPass] = useState(null);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!proof.trim() || !agreed) return;

    const pin = 'FIT-' + Math.floor(1000 + Math.random() * 9000);
    const newClaim = {
      id: 'claim-' + Date.now(),
      itemId: item.id,
      itemTitle: item.title,
      itemRoom: item.room,
      claimantName: currentUser?.name || 'Student',
      claimantEmail: currentUser?.email || 'student@it.campus.edu',
      claimantStudentId: currentUser?.studentId || '2024-XXXX',
      yearSection: currentUser?.yearSection || 'BSIT 3-A',
      proofDescription: proof.trim(),
      claimCode: pin,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      holdingLocation: item.holdingLocation || 'Department Office'
    };

    onSubmitClaim(newClaim);
    setGeneratedPass(newClaim);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheckIcon className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">Claim Ownership Verification</h3>
              <p className="text-xs text-slate-300">Object: {item.title} (Found in {item.room})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!generatedPass ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                <LockIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Verification Notice:</strong> Please describe unique identifying details that only the true owner would know (e.g. folder contents on the flash drive, stickers, engravings, serial number, wallpaper). Your <strong>Instructor</strong> or <strong>Student Officer</strong> will verify this before releasing the object.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Claimant Student:
                </label>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {currentUser?.name} • Student ID: <strong className="font-mono">{currentUser?.studentId}</strong> • Section: <strong className="text-indigo-600">{currentUser?.yearSection || 'BSIT 3-A'}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secret Distinguishing Proof *
                </label>
                <textarea
                  required
                  rows={3}
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  placeholder="e.g. The flash drive has my homework folder named 'Torres_Java' and an ISO file; or my mouse has a tiny scratch on the bottom sensor..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="honorCode"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="honorCode" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                  I certify that I am the rightful owner. Submitting false claims violates the IT Department Honor Code.
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreed}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span>Submit Claim Ticket</span>
                </button>
              </div>
            </form>
          ) : (
            /* Digital Pass Display */
            <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">Claim Pass Issued!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sent to IT Department Instructors and Student Officers for verification.
                </p>
              </div>

              {/* Digital Pass Ticket */}
              <div className="max-w-xs mx-auto p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl relative border border-indigo-400/30">
                <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 mb-1">
                  IT Department Pickup Pass
                </div>

                <div className="text-2xl font-black font-mono tracking-wider text-amber-300">
                  {generatedPass.claimCode}
                </div>

                <div className="my-3 py-2 border-y border-white/10 text-left text-[11px] space-y-1 text-slate-300">
                  <div><span className="text-slate-400">Owner:</span> {generatedPass.claimantName}</div>
                  <div><span className="text-slate-400">Object:</span> {generatedPass.itemTitle}</div>
                  <div><span className="text-slate-400">Room:</span> {generatedPass.itemRoom}</div>
                  <div><span className="text-slate-400">Location:</span> {item.holdingLocation}</div>
                </div>

                <div className="w-20 h-20 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                  <QrCodeIcon className="w-16 h-16 text-slate-900" />
                </div>
                <div className="text-[9px] text-slate-400 mt-2">Present to Instructor or Student Officer</div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
