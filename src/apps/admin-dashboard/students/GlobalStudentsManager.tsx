import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../../shared/context/AppState';
import { Search, MoreVertical, Ban, User } from 'lucide-react';
import { Student } from '../../../shared/types';

// ── Context Menu ─────────────────────────────────────────────────────────────
function StudentContextMenu({
  student,
  onClose,
  onSuspend,
}: {
  student: Student;
  onClose: () => void;
  onSuspend: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-4 top-10 z-30 bg-white border border-slate-200 rounded-xl shadow-xl w-44 overflow-hidden"
    >
      <button
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left"
        onClick={() => { onClose(); }}
      >
        <User className="h-4 w-4 text-slate-400" />
        View Profile
      </button>
      <div className="border-t border-slate-100" />
      <button
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
        onClick={() => { onSuspend(); onClose(); }}
      >
        <Ban className="h-4 w-4" />
        {student.status === 'active' ? 'Deactivate Student' : 'Reactivate Student'}
      </button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function GlobalStudentsManager() {
  const { students, globalTeachers, updateStudent } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Teacher name lookup by classId prefix logic (mock: just display teacherId info)
  const getTeacherName = (classId: string) => {
    // In mock data all students belong to Dr. Shaker's class c-1
    // We'll show the first teacher name from globalTeachers as the "owner" for demo
    return globalTeachers[0]?.name ?? classId;
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (s as any).status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStudentStatus = (student: Student) => {
    // Toggle between active and pending as a demo action (type only allows these two)
    updateStudent({ ...student, status: student.status === 'active' ? 'pending' : 'active' });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Global Students</h1>
        <p className="text-slate-500 font-semibold text-sm mt-1">
          Directory of all students across all teachers. Total: <strong>{students.length}</strong>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {(['all', 'active', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${statusFilter === f ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-semibold ml-auto">{filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Teacher</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Progress</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                    No students match your filters.
                  </td>
                </tr>
              ) : filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors relative group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-600 text-xs">{getTeacherName(student.classId)}</div>
                    <div className="font-mono text-[10px] text-slate-400">{student.classId}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      student.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      student.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-4 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${student.progress >= 70 ? 'bg-emerald-500' : student.progress >= 40 ? 'bg-indigo-500' : 'bg-slate-400'}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-8 text-right">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === student.id ? null : student.id)}
                      className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenuId === student.id && (
                      <StudentContextMenu
                        student={student}
                        onClose={() => setOpenMenuId(null)}
                        onSuspend={() => toggleStudentStatus(student)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
