import React, { useState } from 'react';
import { ITFloorPlan } from './ITFloorPlan';
import { 
  SparklesIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  LockIcon, 
  TagIcon, 
  QrCodeIcon, 
  CheckCircleIcon,
  SearchIcon,
  PlusIcon
} from './Icons';
import { IT_ROOMS, IT_CATEGORIES } from '../mockData/itDepartmentData';

export function StudentDashboard({ 
  currentUser, 
  items, 
  claims, 
  onOpenReport, 
  onClaimItem 
}) {
  const [selectedRoom, setSelectedRoom] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewTab, setViewTab] = useState('feed'); // 'feed' | 'my-claims'
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  // Filter items
  const filteredItems = items.filter(item => {
    if (selectedRoom !== 'All' && item.room !== selectedRoom) return false;
    if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchRoom = item.room.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchRoom) return false;
    }
    return true;
  });

  const myClaims = claims.filter(c => 
    c.claimantStudentId === currentUser.studentId || 
    c.claimantEmail === currentUser.email
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>IT Department Student Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}!
          </h1>

          <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed">
            Student ID: <strong className="text-white font-mono">{currentUser.studentId}</strong> • Program: <strong className="text-white">{currentUser.program || 'BSIT'}</strong> • Section: <strong className="text-indigo-200">{currentUser.yearSection || 'BSIT 3-A'}</strong>
          </p>

          <p className="mt-2 text-indigo-200 text-xs">
            Lost an item in <strong>LAB 42, 43, 44, 45</strong> or <strong>Room 46, 47, 48, 49</strong>? Submit a claim here. Your <strong>Instructors</strong> and <strong>Student Officers</strong> will verify your ownership proof before releasing it from the Department Office.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onOpenReport('lost')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Report Lost Object in Lab/Room</span>
            </button>

            <button
              onClick={() => onOpenReport('found')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md font-bold text-xs text-white border border-white/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Turn In Found Object</span>
            </button>
          </div>
        </div>
      </div>

      {/* IT Department Rooms Quick Status Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Filter by IT Department Spaces:</span>
            <span className="text-[11px] text-indigo-600 font-medium lowercase">Labs 42–45 & Rooms 46–49</span>
          </div>

          <button
            onClick={() => setShowFloorPlan(!showFloorPlan)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {showFloorPlan ? '▲ Close Floor Plan' : '🗺️ View Interactive Floor Plan'}
          </button>
        </div>

        {/* Interactive Floor Plan when open */}
        {showFloorPlan && (
          <div className="pt-2 animate-in fade-in duration-200">
            <ITFloorPlan 
              items={items} 
              selectedRoom={selectedRoom} 
              onSelectRoom={(room) => setSelectedRoom(room)} 
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => setSelectedRoom('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRoom === 'All'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Spaces ({items.length})
          </button>

          {IT_ROOMS.map(room => {
            const count = items.filter(i => i.room === room.name).length;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedRoom === room.name
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{room.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedRoom === room.name ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800 font-bold'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs: Browse Objects vs My Claims */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-4 text-xs font-bold">
          <button
            onClick={() => setViewTab('feed')}
            className={`pb-3 px-2 border-b-2 transition-all ${
              viewTab === 'feed'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Lost & Found Objects in IT Dept ({filteredItems.length})
          </button>

          <button
            onClick={() => setViewTab('my-claims')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              viewTab === 'my-claims'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>My Submitted Claims & Passes</span>
            {myClaims.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
                {myClaims.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Input */}
        {viewTab === 'feed' && (
          <div className="relative w-48 sm:w-64">
            <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flash drive, mouse, ID..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: ITEMS FEED */}
      {viewTab === 'feed' && (
        <div>
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 text-xs">No objects recorded for {selectedRoom}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail / Header */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono text-xs">
                          [No Photo]
                        </div>
                      )}

                      {/* Room Badge */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 text-white shadow-sm">
                          📍 {item.room}
                        </span>
                        <span className={`px-2 py-1 rounded-xl text-xs font-bold text-white shadow-sm ${
                          item.type === 'found' ? 'bg-indigo-600' : 'bg-rose-600'
                        }`}>
                          {item.type === 'found' ? 'Found' : 'Lost Notice'}
                        </span>
                      </div>

                      {item.privateDetail && (
                        <div className="absolute top-3 right-3" title="Requires secret proof verification">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-amber-300">
                            <LockIcon className="w-3 h-3" />
                            <span>Verified Lock</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-slate-400">{item.dateReported}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                        <div><strong>Reported by:</strong> {item.finderName}</div>
                        <div><strong>Holding spot:</strong> {item.holdingLocation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      item.status === 'claim_pending' ? 'bg-amber-100 text-amber-800' :
                      item.status === 'in_custody' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {item.status === 'claim_pending' ? 'Verification in Progress' : 
                       item.status === 'in_custody' ? 'Secured in Dept' : 'Open'}
                    </span>

                    {item.type === 'found' && item.status !== 'resolved' && (
                      <button
                        onClick={() => onClaimItem(item)}
                        className="px-4 py-1.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                      >
                        This is Mine (Claim)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY CLAIMS & PASSES */}
      {viewTab === 'my-claims' && (
        <div className="space-y-4">
          {myClaims.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <CheckCircleIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Active Claims Submitted</h3>
              <p className="text-xs text-slate-500 mt-1">
                If you lost an item and spot it in the feed, click "This is Mine (Claim)" to generate your verification pass.
              </p>
            </div>
          ) : (
            myClaims.map(claim => (
              <div 
                key={claim.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                      PIN: {claim.claimCode}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Location: {claim.itemRoom}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{claim.itemTitle}</h3>
                  <p className="text-xs text-slate-600 mt-1 italic">
                    Your proof submitted: "{claim.proofDescription}"
                  </p>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Station: <strong>{claim.holdingLocation}</strong> • Present this PIN to your <strong>Instructor</strong> or <strong>Student Officer</strong>.
                  </div>
                </div>

                {/* Digital Pass Pill */}
                <div className="shrink-0 p-3 rounded-2xl bg-slate-900 text-white text-center border border-indigo-400/30">
                  <div className="text-[9px] uppercase tracking-widest text-indigo-300">Claim Code</div>
                  <div className="text-lg font-black font-mono text-amber-300">{claim.claimCode}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Show to Instructor</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
