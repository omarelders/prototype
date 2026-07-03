import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppState } from '../../../shared/context/AppState';
import { Student } from '../../../shared/types';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Search, 
  ChevronRight, 
  X,
  CreditCard,
  History,
  Activity,
  Award,
  MessageSquare,
  Key,
  BarChart3,
  Plus,
  UserPlus,
  AlertCircle,
  Wallet,
  Upload,
  Download
} from 'lucide-react';

export default function StudentsManager() {
  const { 
    currentLanguage, 
    students, 
    confirmStudentPayment, 
    rejectStudentPayment,
    classes,
    walletBalance,
    activateStudentWithWallet,
    addStudent,
    teacherProfile
  } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'pending'>('active');

  // Drawer states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Receipt verification lightbox state
  const [reviewReceiptStudent, setReviewReceiptStudent] = useState<Student | null>(null);

  // Quick Add states
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'excel'>('manual');
  const [quickStudentName, setQuickStudentName] = useState('');
  const [quickStudentEmail, setQuickStudentEmail] = useState('');
  const [quickStudentClass, setQuickStudentClass] = useState('c-1');
  const [insufficientFundsStudent, setInsufficientFundsStudent] = useState<Student | {id: string, name: string, paymentAmount: number} | null>(null);

  // Excel states
  const [excelPreview, setExcelPreview] = useState<{name: string, email: string}[]>([]);
  
  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });
      
      const parsed: {name: string, email: string}[] = [];
      const hasHeader = json[0] && (String(json[0][0]).toLowerCase().includes('name') || String(json[0][1]).toLowerCase().includes('email'));
      const startIndex = hasHeader ? 1 : 0;
      
      for (let i = startIndex; i < json.length; i++) {
        const row = json[i];
        if (row && row[0] && row[1]) {
          parsed.push({ name: String(row[0]).trim(), email: String(row[1]).trim() });
        }
      }
      setExcelPreview(parsed);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadExcelTemplate = () => {
    const data = [
      ["Name", "Email"],
      ["Mazen Khaled", "mazen@example.com"],
      ["Sara Ahmed", "sara@example.com"]
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "student_template.xlsx");
  };

  const handleActivateWithWallet = (student: Student) => {
    const cost = student.paymentAmount || teacherProfile.studentPrice || 150;
    if (walletBalance < cost) {
      setInsufficientFundsStudent(student);
      return;
    }
    activateStudentWithWallet(student.id, cost);
  };

  const getBulkCost = () => {
    let cost = 0;
    selectedIds.forEach(id => {
      const student = students.find(s => s.id === id);
      if (student) cost += (student.paymentAmount || teacherProfile.studentPrice || 150);
    });
    return cost;
  };

  const handleBulkActivate = () => {
    const totalCost = getBulkCost();
    if (walletBalance < totalCost) {
      setInsufficientFundsStudent({ id: 'bulk', name: currentLanguage === 'en' ? `${selectedIds.size} Students` : `${selectedIds.size} طلاب`, paymentAmount: totalCost });
      setShowBulkConfirm(false);
      return;
    }
    
    selectedIds.forEach(id => {
      const student = students.find(s => s.id === id);
      if (student) {
        const cost = student.paymentAmount || teacherProfile.studentPrice || 150;
        activateStudentWithWallet(id, cost);
      }
    });
    setSelectedIds(new Set());
    setShowBulkConfirm(false);
  };

  // Translations
  const dict = {
    en: {
      alertTitle: "Students awaiting manual payment activation",
      activeTab: "Active Students",
      pendingTab: "Pending Activation",
      colName: "Student Name",
      colEmail: "Email",
      colProgress: "Study Progress",
      colStatus: "Status",
      colActions: "Actions",
      actions: {
        reviewReceipt: "Review Receipt",
        details: "Student Details",
        active: "Active",
        pending: "Pending"
      },
      detailTitle: "Student Profile",
      progressTitle: "Syllabus Progress",
      gradesTitle: "Quiz & Exam Grades",
      paymentHistoryTitle: "Payment Records",
      notesTitle: "Private Notes",
      receiptViewerTitle: "Vodafone Cash Receipt Verification",
      amountPaid: "Amount Transferred",
      dateTransferred: "Transaction Date",
      confirmBtn: "Confirm Payment",
      rejectBtn: "Reject / Return",
      noPending: "No student payments pending approval.",
      courseSyllabus: "Course Syllabus",
      avgQuizScore: "Average Quiz Score",
      platformEngagement: "Platform Engagement",
      engagementHigh: "High",
      selectProfileMsg: "Select an active student profile from the list to view academic analytics, quiz scores, and payment records.",
      success: "SUCCESS",
      amountSent: "Amount Sent:",
      date: "Date:",
      required: "Required:",
      currentBalance: "Current Balance:",
      privateNotePlaceholder: "Write a private student note...",
      egp: "EGP"
    },
    ar: {
      alertTitle: "طلاب بانتظار مراجعة وتفعيل اشتراكاتهم",
      activeTab: "الطلاب النشطين",
      pendingTab: "طلبات التفعيل المعلقة",
      colName: "اسم الطالب",
      colEmail: "البريد الإلكتروني",
      colProgress: "تقدم الطالب",
      colStatus: "حالة التفعيل",
      colActions: "خيارات",
      actions: {
        reviewReceipt: "مراجعة إيصال التحويل",
        details: "الملف الأكاديمي للطالب",
        active: "نشط",
        pending: "معلق"
      },
      detailTitle: "الملف الدراسي للطالب",
      progressTitle: "مستوى تقدم المنهج الدراسي",
      gradesTitle: "سجل نتائج الاختبارات والامتحانات",
      paymentHistoryTitle: "سجل عمليات الدفع",
      notesTitle: "ملاحظات المعلم الخاصة",
      receiptViewerTitle: "التحقق من إيصال فودافون كاش / إنستاباي",
      amountPaid: "المبلغ المحول",
      dateTransferred: "تاريخ عملية التحويل",
      confirmBtn: "موافقة وتفعيل الحساب",
      rejectBtn: "رفض الإيصال وإبلاغ الطالب",
      noPending: "لا توجد طلبات تفعيل معلقة حالياً.",
      courseSyllabus: "منهج المادة الدراسي",
      avgQuizScore: "متوسط درجات الاختبارات",
      platformEngagement: "مستوى التفاعل مع المنصة",
      engagementHigh: "مرتفع للغاية",
      selectProfileMsg: "اختر ملفاً لطالب نشط من القائمة لعرض تفاصيل تحليلاته الدراسية وسجل درجاته ومدفوعاته.",
      success: "تم الإيداع",
      amountSent: "المبلغ المرسل:",
      date: "التاريخ:",
      required: "المطلوب:",
      currentBalance: "الرصيد الحالي:",
      privateNotePlaceholder: "اكتب ملاحظة خاصة عن مستوى الطالب...",
      egp: "ج.م"
    }
  };

  const t = dict[currentLanguage];

  const pendingStudents = students.filter(s => s.status === 'pending');
  const activeStudents = students.filter(s => s.status === 'active');

  const filteredList = (activeSubTab === 'active' ? activeStudents : pendingStudents).filter(s => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
      {/* Alert Banner for pending Vodafone cash activations */}
      {pendingStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700">
              <ShieldAlert className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-amber-900 text-sm">{t.alertTitle}</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {currentLanguage === 'en' 
                  ? `There are ${pendingStudents.length} students who have uploaded manual transfer receipts and are waiting for your approval.`
                  : `يوجد عدد ${pendingStudents.length} طلاب قاموا برفع إيصالات الدفع وبانتظار تأكيدك لتفعيل الخدمة.`}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveSubTab('pending')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all"
          >
            {currentLanguage === 'en' ? 'Review Now' : 'مراجعة الآن'}
          </button>
        </div>
      )}

      {/* Tabs list & Search bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 w-full">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setActiveSubTab('active');
                setSelectedIds(new Set());
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeSubTab === 'active' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.activeTab} ({activeStudents.length})
            </button>
            <button 
              onClick={() => {
                setActiveSubTab('pending');
                setSelectedIds(new Set());
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeSubTab === 'pending' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.pendingTab} ({pendingStudents.length})
            </button>
          </div>

          <button
            onClick={() => {
              setQuickStudentName('');
              setQuickStudentEmail('');
              setQuickStudentClass(classes[0]?.id || 'c-1');
              setExcelPreview([]);
              setShowQuickAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>{currentLanguage === 'en' ? 'Quick Add & Activate' : 'إضافة وتفعيل سريع'}</span>
          </button>
        </div>

        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search students by name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* Main Grid Tables */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Table data container */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Users className="h-8 w-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">{t.noPending}</p>
            </div>
          ) : (
            <table className="w-full text-sm text-slate-500">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                      checked={filteredList.length > 0 && selectedIds.size === filteredList.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(filteredList.map(s => s.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colName}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colEmail}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colProgress}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colStatus}</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                {filteredList.map(student => (
                  <tr key={student.id} className={`hover:bg-slate-50/50 transition-colors ${selectedIds.has(student.id) ? 'bg-indigo-50/20' : ''}`}>
                    <td className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                        checked={selectedIds.has(student.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedIds);
                          if (e.target.checked) newSet.add(student.id);
                          else newSet.delete(student.id);
                          setSelectedIds(newSet);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-bold">{student.name}</td>
                    <td className="px-6 py-4 truncate max-w-[120px]">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 flex-shrink-0">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="font-mono text-xs">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        student.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700 animate-pulse'
                      }`}>
                        {student.status === 'active' ? t.actions.active : t.actions.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {student.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReviewReceiptStudent(student)}
                            className="bg-amber-50 text-amber-700 border border-amber-200/50 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                          >
                            {t.actions.reviewReceipt}
                          </button>
                          <button
                            onClick={() => handleActivateWithWallet(student)}
                            className="bg-indigo-50 text-indigo-700 border border-indigo-200/50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                          >
                            <Wallet className="h-3.5 w-3.5" />
                            <span>{currentLanguage === 'en' ? 'Wallet' : 'المحفظة'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Message Student"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button
                            title="Reset Password"
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          <button
                            title={t.actions.details}
                            onClick={() => setSelectedStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 3. Detailed Side Profile Popup Drawer (displays inside grid on right side) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
          {selectedStudent ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{t.detailTitle}</h3>
                  <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">{selectedStudent.email}</span>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress visual trackers */}
              <div className="space-y-5 text-xs font-semibold text-slate-600">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    <span>{t.progressTitle}</span>
                  </span>
                  
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4">
                    {/* Course Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{t.courseSyllabus}</span>
                        <span className="font-bold text-indigo-600">{selectedStudent.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${selectedStudent.progress}%` }} />
                      </div>
                    </div>

                    {/* Average Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{t.avgQuizScore}</span>
                        <span className="font-bold text-emerald-600">82%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" style={{ width: '82%' }} />
                      </div>
                    </div>

                    {/* Attendance / Engagement */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{t.platformEngagement}</span>
                        <span className="font-bold text-amber-600">{t.engagementHigh}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam grades summary */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span>{t.gradesTitle}</span>
                  </span>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Unit 1 Midterm Exam</span>
                      <span className="text-emerald-600">10 / 12 (83%)</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-700">
                      <span>Resistors Practice Set</span>
                      <span className="text-emerald-600">4 / 5 (80%)</span>
                    </div>
                  </div>
                </div>

                {/* Payments Log history */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <History className="h-4 w-4 text-indigo-600" />
                    <span>{t.paymentHistoryTitle}</span>
                  </span>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] leading-relaxed text-slate-500 font-medium">
                    <p>● June 2026 Monthly Subscription Fee: <span className="font-bold text-slate-800">150 EGP (Paid)</span></p>
                    <p>● May 2026 Monthly Subscription Fee: <span className="font-bold text-slate-800">150 EGP (Paid)</span></p>
                  </div>
                </div>

                {/* Teacher notes text block */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span>{t.notesTitle}</span>
                  </span>
                  <textarea
                    rows={2}
                    placeholder={t.privateNotePlaceholder}
                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 outline-none rounded-xl text-[11px] resize-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-400 text-center space-y-3">
              <Users className="h-8 w-8 text-slate-300" />
              <p className="text-xs font-semibold px-6 leading-normal">{t.selectProfileMsg}</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for Vodafone Cash Manual receipt verification */}
      {reviewReceiptStudent && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-5 text-left animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">{t.receiptViewerTitle}</h3>
              <button onClick={() => setReviewReceiptStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Realistic Vodafone Cash transaction ticket graphic mockup */}
            <div className="bg-slate-950 rounded-xl font-mono text-[10px] border border-slate-800 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-bl font-bold text-[8px] tracking-wider uppercase z-10">{t.success}</div>
              <img src="/mock_receipt.png" alt="Vodafone Cash Receipt" className="w-full h-48 object-cover opacity-90" />
              <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-1 text-emerald-400">
                <div className="flex justify-between">
                  <span className="text-emerald-600">{t.amountSent}</span>
                  <span className="text-white font-bold">{reviewReceiptStudent.paymentAmount} {t.egp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-600">{t.date}</span>
                  <span className="text-white font-bold">{reviewReceiptStudent.paymentDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  confirmStudentPayment(reviewReceiptStudent.id);
                  setReviewReceiptStudent(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{t.confirmBtn}</span>
              </button>

              <button
                onClick={() => {
                  const cost = reviewReceiptStudent.paymentAmount || teacherProfile.studentPrice || 150;
                  if (walletBalance < cost) {
                    setInsufficientFundsStudent(reviewReceiptStudent);
                    setReviewReceiptStudent(null);
                    return;
                  }
                  activateStudentWithWallet(reviewReceiptStudent.id, cost);
                  setReviewReceiptStudent(null);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                <span>{currentLanguage === 'en' ? 'Activate via Wallet' : 'تفعيل خصماً من المحفظة'}</span>
              </button>

              <button
                onClick={() => {
                  rejectStudentPayment(reviewReceiptStudent.id);
                  setReviewReceiptStudent(null);
                }}
                className="w-full border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                <span>{t.rejectBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Student Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              
              if (addMode === 'manual') {
                if (!quickStudentName || !quickStudentEmail) return;
                
                const newId = `st-${Date.now()}`;
                addStudent({
                  id: newId,
                  name: quickStudentName,
                  email: quickStudentEmail,
                  classId: quickStudentClass,
                  subscriptionType: 'monthly',
                  status: 'active', 
                  progress: 0,
                  lastSeen: new Date().toISOString()
                });

                setShowQuickAddModal(false);
              } else {
                // Excel Mode
                if (excelPreview.length === 0) return;
                
                excelPreview.forEach((st, index) => {
                  const newId = `st-excel-${Date.now()}-${index}`;
                  addStudent({
                    id: newId,
                    name: st.name,
                    email: st.email,
                    classId: quickStudentClass,
                    subscriptionType: 'monthly',
                    status: 'active',
                    progress: 0,
                    lastSeen: new Date().toISOString()
                  });
                });
                
                setShowQuickAddModal(false);
              }
            }}
            className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-5 text-left animate-scale-up"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-indigo-600" />
                <span>{currentLanguage === 'en' ? 'Add Student(s)' : 'إضافة طالب / طلاب'}</span>
              </h3>
              <button type="button" onClick={() => setShowQuickAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 mb-4">
              <button
                type="button"
                onClick={() => setAddMode('manual')}
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  addMode === 'manual' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {currentLanguage === 'en' ? 'Manual Entry' : 'إدخل يدوياً'}
              </button>
              <button
                type="button"
                onClick={() => setAddMode('excel')}
                className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 ${
                  addMode === 'excel' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {currentLanguage === 'en' ? 'Upload Excel' : 'رفع ملف إكسيل'}
              </button>
            </div>

            {addMode === 'manual' ? (
              <div className="space-y-4">
                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {currentLanguage === 'en' ? 'Student Full Name' : 'اسم الطالب الكامل'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mazen Khaled"
                    value={quickStudentName}
                    onChange={e => setQuickStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {currentLanguage === 'en' ? 'Student Email' : 'البريد الإلكتروني'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={quickStudentEmail}
                    onChange={e => setQuickStudentEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {currentLanguage === 'en' ? 'Class Group' : 'المجموعة / الصف'}
                  </label>
                  <select
                    value={quickStudentClass}
                    onChange={e => setQuickStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold"
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {currentLanguage === 'en' ? 'Upload Excel File (.xlsx)' : 'رفع ملف إكسيل (.xlsx)'}
                    </label>
                    <button 
                      type="button" 
                      onClick={handleDownloadExcelTemplate}
                      className="text-[10px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold animate-pulse-soft"
                    >
                      <Download className="h-3 w-3" />
                      {currentLanguage === 'en' ? 'Download template' : 'تحميل نموذج'}
                    </button>
                  </div>
                  
                  {/* Inline Excel Template display */}
                  <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-[10px] font-mono text-slate-600 leading-normal">
                    <span className="font-bold text-slate-400 block mb-1">
                      {currentLanguage === 'en' ? 'Required Excel Columns:' : 'الأعمدة المطلوبة في ملف الإكسيل:'}
                    </span>
                    <table className="w-full border border-slate-200 text-left bg-white text-[9px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="px-1.5 py-0.5">A (Name)</th>
                          <th className="px-1.5 py-0.5">B (Email)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="px-1.5 py-0.5">Mazen Khaled</td>
                          <td className="px-1.5 py-0.5">mazen@example.com</td>
                        </tr>
                        <tr>
                          <td className="px-1.5 py-0.5">Sara Ahmed</td>
                          <td className="px-1.5 py-0.5">sara@example.com</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                      <Upload className="w-5 h-5 mb-1 text-slate-400" />
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {currentLanguage === 'en' ? 'Click to upload Excel' : 'اضغط لرفع ملف إكسيل'}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
                  </label>
                </div>

                {excelPreview.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                    <p className="text-xs text-emerald-700 font-bold mb-2">
                      {currentLanguage === 'en' ? `Parsed ${excelPreview.length} students successfully.` : `تم قراءة ${excelPreview.length} طلاب بنجاح.`}
                    </p>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                      {excelPreview.slice(0, 3).map((st, i) => (
                        <div key={i} className="flex justify-between text-[10px] bg-white px-2 py-1.5 rounded text-slate-600 border border-emerald-100">
                          <span className="font-bold truncate w-1/2">{st.name}</span>
                          <span className="truncate w-1/2 text-right">{st.email}</span>
                        </div>
                      ))}
                      {excelPreview.length > 3 && (
                        <div className="text-[10px] text-center text-slate-400 font-semibold pt-1">
                          + {excelPreview.length - 3} {currentLanguage === 'en' ? 'more' : 'آخرين'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 text-xs font-bold text-slate-700">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {currentLanguage === 'en' ? 'Assign to Class Group' : 'إضافة إلى المجموعة'}
                  </label>
                  <select
                    value={quickStudentClass}
                    onChange={e => setQuickStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold"
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuickAddModal(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              
              <button
                type="submit"
                disabled={
                  (addMode === 'manual' && (!quickStudentName || !quickStudentEmail)) ||
                  (addMode === 'excel' && excelPreview.length === 0)
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Add Student' : 'إضافة الطالب'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Insufficient Balance warning modal */}
      {insufficientFundsStudent && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-5 text-left animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-rose-600 text-sm flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                <span>{currentLanguage === 'en' ? 'Insufficient Wallet Balance' : 'رصيد المحفظة غير كافٍ'}</span>
              </h3>
              <button onClick={() => setInsufficientFundsStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3 font-semibold text-xs text-slate-600 leading-relaxed">
              <p>
                {currentLanguage === 'en' 
                  ? `You are attempting to activate ${insufficientFundsStudent.id === 'bulk' ? 'a batch of students' : `student "${insufficientFundsStudent.name}"`} which costs ${(insufficientFundsStudent as any).paymentAmount || teacherProfile.studentPrice || 150} EGP.`
                  : `أنت تحاول تفعيل ${insufficientFundsStudent.id === 'bulk' ? 'دفعة من الطلاب' : `اشتراك الطالب "${insufficientFundsStudent.name}"`} بتكلفة ${(insufficientFundsStudent as any).paymentAmount || teacherProfile.studentPrice || 150} ج.م.`
                }
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.required}</span>
                  <span className="text-slate-800 font-bold">{(insufficientFundsStudent as any).paymentAmount || teacherProfile.studentPrice || 150} {t.egp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.currentBalance}</span>
                  <span className="text-rose-600 font-bold">{walletBalance} {t.egp}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-normal">
                {currentLanguage === 'en'
                  ? "Please top up your prepaid wallet balance using Credit Card, Instapay, or Vodafone Cash to proceed."
                  : "يرجى شحن رصيد محفظتك الرقمية باستخدام البطاقة الائتمانية أو إنستاباي أو فودافون كاش للمتابعة."
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setInsufficientFundsStudent(null)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Close' : 'إغلاق'}
              </button>

              <button
                onClick={() => {
                  setInsufficientFundsStudent(null);
                  window.dispatchEvent(new CustomEvent('open-wallet-modal'));
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                <span>{currentLanguage === 'en' ? 'Top Up Wallet' : 'شحن المحفظة الآن'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Activation Confirmation Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 text-left animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Users className="h-4 w-4 text-indigo-600" />
                <span>{currentLanguage === 'en' ? 'Confirm Bulk Activation' : 'تأكيد التفعيل المجمع'}</span>
              </h3>
              <button onClick={() => setShowBulkConfirm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl space-y-3">
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {currentLanguage === 'en' 
                  ? `You are about to activate ${selectedIds.size} selected students. This will deduct the required amount from your wallet.`
                  : `أنت على وشك تفعيل ${selectedIds.size} طالب محدد. سيتم خصم المبلغ المطلوب من رصيد محفظتك.`}
              </p>
              
              <div className="bg-white rounded-lg p-3 border border-indigo-50">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">{currentLanguage === 'en' ? 'Selected Students:' : 'الطلاب المحددين:'}</span>
                  <span className="text-indigo-600">{selectedIds.size}</span>
                </div>
                <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-100 mt-2">
                  <span className="text-slate-500">{currentLanguage === 'en' ? 'Total Deduction:' : 'إجمالي الخصم:'}</span>
                  <span className="text-indigo-600">{getBulkCost()} {t.egp}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
              
              <button
                onClick={handleBulkActivate}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                <span>{currentLanguage === 'en' ? 'Confirm Activation' : 'تأكيد التفعيل'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-full px-6 py-4 flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-700 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {selectedIds.size}
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  {currentLanguage === 'en' ? 'Students Selected' : 'طلاب محددين'}
                </p>
                <p className="text-[10px] font-bold text-slate-500">
                  {currentLanguage === 'en' ? 'Total Value: ' : 'الإجمالي: '}
                  <span className="text-indigo-600">{getBulkCost()} {t.egp}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 transition-colors"
              >
                {currentLanguage === 'en' ? 'Clear' : 'إلغاء التحديد'}
              </button>
              <button
                onClick={() => setShowBulkConfirm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-full text-xs shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Activate Selected' : 'تفعيل المحددين'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
