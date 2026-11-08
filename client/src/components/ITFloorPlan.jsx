import React from 'react';
import { BuildingIcon, CpuIcon, MapPinIcon } from './Icons';

export function ITFloorPlan({ items, selectedRoom, onSelectRoom }) {
  const labs = [
    { id: 'lab_42', name: 'LAB 42', spec: 'Programming & Web Dev Lab', pcs: '40 Workstations' },
    { id: 'lab_43', name: 'LAB 43', spec: 'Cisco & Networking Lab', pcs: '35 Workstations + Switch Racks' },
    { id: 'lab_44', name: 'LAB 44', spec: 'Multimedia & Database Lab', pcs: '40 Mac & PC Stations' },
    { id: 'lab_45', name: 'LAB 45', spec: 'Systems Analysis & Capstone', pcs: '35 Workstations' }
  ];

  const lectureRooms = [
    { id: 'room_46', name: 'Room 46', spec: 'Discrete Math & General IT' },
    { id: 'room_47', name: 'Room 47', spec: 'Algorithms & Data Structures' },
    { id: 'room_48', name: 'Room 48', spec: 'Cybersecurity & Ethics' },
    { id: 'room_49', name: 'Room 49', spec: 'Mobile App Development' }
  ];

  const getItemCount = (roomName) => items.filter(i => i.room === roomName && i.status !== 'resolved').length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <CpuIcon className="w-5 h-5 text-indigo-600" />
            <span>IT Department Interactive Floor Plan</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click on any Computer Lab, Lecture Room, or Department Office to filter objects found in that space.
          </p>
        </div>

        {selectedRoom !== 'All' && (
          <button
            onClick={() => onSelectRoom('All')}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
          >
            Clear Room Filter (Show All)
          </button>
        )}
      </div>

      {/* Visual Floor Layout */}
      <div className="space-y-4 text-xs">
        
        {/* Row 1: Central Department Office */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Central Administrative Hub:
          </span>
          <div
            onClick={() => onSelectRoom(selectedRoom === 'Department Office' ? 'All' : 'Department Office')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              selectedRoom === 'Department Office'
                ? 'border-purple-600 bg-purple-50/80 shadow-md ring-2 ring-purple-400/20'
                : 'border-purple-200 bg-purple-50/30 hover:border-purple-400 hover:bg-purple-50/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                🏢
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">IT Department Main Office</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                    Dept Head • Secretary • Instructors
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Central lost & found custody safe cabinet, intake counter, and staff faculty desks.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-xs px-2.5 py-1 rounded-xl bg-white border border-purple-200 text-purple-900 shadow-sm">
                {getItemCount('Department Office')} Objects in Custody
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Computer Laboratories (LAB 42 - 45) */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Computer Laboratories Wing (High-Activity Zone):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {labs.map(lab => {
              const count = getItemCount(lab.name);
              const isSelected = selectedRoom === lab.name;

              return (
                <div
                  key={lab.id}
                  onClick={() => onSelectRoom(isSelected ? 'All' : lab.name)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/90 shadow-md ring-2 ring-indigo-400/20'
                      : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-slate-900">{lab.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        count > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count} items
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-700">{lab.spec}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{lab.pcs}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                    {isSelected ? '✓ Showing Objects' : 'Click to inspect lab'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 3: Lecture Rooms (Room 46 - 49) */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Lecture Rooms Wing:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {lectureRooms.map(rm => {
              const count = getItemCount(rm.name);
              const isSelected = selectedRoom === rm.name;

              return (
                <div
                  key={rm.id}
                  onClick={() => onSelectRoom(isSelected ? 'All' : rm.name)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-black text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {rm.name}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count} items
                    </span>
                  </div>
                  <div className={`text-[10px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {rm.spec}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
