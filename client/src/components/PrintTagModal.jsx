import React from 'react';
import { XIcon, QrCodeIcon, CpuIcon, PackageIcon } from './Icons';

export function PrintTagModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CpuIcon className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Official IT Dept Custody Tag</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Tag Body */}
        <div className="p-6">
          <div className="border-2 border-dashed border-slate-300 p-5 rounded-2xl bg-amber-50/20 text-slate-800 space-y-3 font-mono text-xs">
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-2">
              <div className="font-extrabold text-sm tracking-wider uppercase text-slate-900">
                IT DEPARTMENT PROPERTY EVIDENCE TAG
              </div>
              <div className="text-[10px] text-slate-500">
                LAB 42–45 • ROOM 46–49 • DEPARTMENT OFFICE
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Property ID:</span>
                <span className="font-bold text-indigo-700">#IT-{item.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Date Logged:</span>
                <span className="font-semibold">{item.dateReported}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase">Origin Space:</span>
              <span className="font-black text-slate-900 bg-indigo-50 px-2 py-0.5 rounded inline-block text-xs">
                📍 {item.room}
              </span>
            </div>

            <div className="border-t border-slate-100 pt-2 text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase">Object Name:</span>
              <span className="font-bold text-slate-900">{item.title}</span>
            </div>

            <div className="border-t border-slate-100 pt-2 text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase">Holding Location:</span>
              <span className="font-bold text-indigo-700">{item.holdingLocation}</span>
            </div>

            <div className="border-t border-slate-100 pt-2 text-[11px]">
              <span className="text-slate-400 block text-[9px] uppercase">Logged By:</span>
              <span className="text-slate-700">{item.finderName}</span>
            </div>

            {/* Simulated QR Code for Handover */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[9px] text-slate-400 leading-tight">
                <div>IT CUSTODY SAFE</div>
                <div>VERIFIED HANDOVER ONLY</div>
              </div>
              <div className="bg-white p-1 rounded-lg border border-slate-300">
                <QrCodeIcon className="w-10 h-10 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>🖨️ Print Custody Tag</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
