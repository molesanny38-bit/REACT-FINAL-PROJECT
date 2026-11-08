import React, { useState } from 'react';
import { XIcon, PlusIcon, LockIcon, TagIcon } from './Icons';
import { IT_ROOMS, IT_CATEGORIES } from '../mockData/itDepartmentData';

export function ReportModal({ isOpen, onClose, onAddItem, currentUser, defaultType = 'lost' }) {
  const [reportType, setReportType] = useState(defaultType); // 'lost' | 'found'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Flash Drives & Storage');
  const [room, setRoom] = useState('LAB 42');
  const [description, setDescription] = useState('');
  const [privateDetail, setPrivateDetail] = useState('');
  const [holdingLocation, setHoldingLocation] = useState('Department Office - Secretary Front Desk');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newItem = {
      id: Date.now(),
      type: reportType,
      title: title.trim(),
      category,
      room,
      description: description.trim(),
      privateDetail: privateDetail.trim(),
      holdingLocation: reportType === 'found' ? holdingLocation : 'Not turned in yet',
      dateReported: new Date().toISOString().split('T')[0],
      status: reportType === 'found' ? 'in_custody' : 'open',
      imageUrl: imageUrl || '',
      finderName: `${currentUser?.name} (${currentUser?.role === 'instructor' ? 'Instructor' : currentUser?.role === 'officer' ? 'Student Officer' : currentUser?.yearSection || 'Student'})`
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <PlusIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Record Object in IT Department</h3>
              <p className="text-xs text-slate-300">LAB 42–45, Room 46–49 & Department Office</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Toggle Type */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setReportType('lost')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                reportType === 'lost'
                  ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🔍 I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setReportType('found')}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                reportType === 'found'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ✨ I Found Something
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Object Name / Model *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SanDisk 64GB Flash Drive or Logitech Mouse"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">IT Department Room *</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {IT_ROOMS.map(r => (
                  <option key={r.id} value={r.name}>{r.name} ({r.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {IT_CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Public Description *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, brand, or which computer station row it was found in."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Secret Proof Detail */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-1">
              <LockIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>Secret Verification Detail (Confidential)</span>
            </div>
            <p className="text-[11px] text-amber-800 mb-1.5 leading-relaxed">
              {reportType === 'found'
                ? "Secret details (stickers, folder names inside USB, scratches, serial digits). Instructors and Student Officers will compare this when a student claims it."
                : "Describe secret identifying features to prove ownership when claiming."}
            </p>
            <input
              type="text"
              value={privateDetail}
              onChange={(e) => setPrivateDetail(e.target.value)}
              placeholder="e.g. Contains folder named 'Java_Project_Chen' and serial ends in 981"
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* If Found: Holding Spot */}
          {reportType === 'found' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Holding Location in Department:</label>
              <select
                value={holdingLocation}
                onChange={(e) => setHoldingLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Department Office - Secretary Front Desk">Department Office - Secretary Front Desk</option>
                <option value="Department Office - Safe Cabinet Shelf #1">Department Office - Safe Cabinet Shelf #1</option>
                <option value="Department Office - Student Council Locker">Department Office - Student Council Locker</option>
                <option value="LAB 42 - Instructor Desk Drawer">LAB 42 - Instructor Desk Drawer</option>
                <option value="LAB 43 - Instructor Desk Drawer">LAB 43 - Instructor Desk Drawer</option>
                <option value="LAB 44 - Instructor Desk Drawer">LAB 44 - Instructor Desk Drawer</option>
                <option value="LAB 45 - Instructor Desk Drawer">LAB 45 - Instructor Desk Drawer</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL (Optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Record Object</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
