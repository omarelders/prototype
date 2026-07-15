import React, { useState } from 'react';
import { useAppState, AppStateProvider } from './shared/context/AppState';
import { Lesson, Exam, ExamSubmission } from './shared/types';
import { Settings as DevIcon, RefreshCw, Layers, X } from 'lucide-react';

// Level 0 imports
import AdminDashboardLayout from './apps/admin-dashboard/AdminDashboardLayout';
import AdminHome from './apps/admin-dashboard/dashboard/AdminHome';
import TeachersManager from './apps/admin-dashboard/teachers/TeachersManager';
import GlobalStudentsManager from './apps/admin-dashboard/students/GlobalStudentsManager';
import AffiliatesDashboard from './apps/admin-dashboard/affiliates/AffiliatesDashboard';
import AffiliatesManager from './apps/admin-dashboard/affiliates/AffiliatesManager';
import PayoutsManager from './apps/admin-dashboard/affiliates/PayoutsManager';

// Level 1 imports
import LandingPage from './apps/public-site/landing/LandingPage';
import OnboardingWizard from './apps/public-site/onboarding/OnboardingWizard';
import TeacherLandingPage from './apps/public-site/landing/TeacherLandingPage';

// Level 2 imports
import TeacherDashboardLayout from './apps/teacher-dashboard/TeacherDashboardLayout';
import DashboardHome from './apps/teacher-dashboard/dashboard/DashboardHome';
import ContentManager from './apps/teacher-dashboard/content/ContentManager';
import QuestionBank from './apps/teacher-dashboard/question-bank/QuestionBank';
import ExamsManager from './apps/teacher-dashboard/exams/ExamsManager';
import StudentsManager from './apps/teacher-dashboard/students/StudentsManager';
import ActivationManager from './apps/teacher-dashboard/activation/ActivationManager';
import CalendarView from './apps/teacher-dashboard/calendar/CalendarView';
import FinanceDashboard from './apps/teacher-dashboard/finance/FinanceDashboard';
import AnalyticsDashboard from './apps/teacher-dashboard/analytics/AnalyticsDashboard';
import SettingsPanel from './apps/teacher-dashboard/settings/SettingsPanel';
import GradingManager from './apps/teacher-dashboard/grading/GradingManager';

// Level 3 imports
import StudentPortalLayout from './apps/teacher-dashboard/student-portal/StudentPortalLayout';
import StudentDashboard from './apps/teacher-dashboard/student-portal/dashboard/StudentDashboard';
import LessonViewer from './apps/teacher-dashboard/student-portal/lesson/LessonViewer';
import ExamTaker from './apps/teacher-dashboard/student-portal/exam/ExamTaker';
import ExamResults from './apps/teacher-dashboard/student-portal/results/ExamResults';

// Affiliate imports
import AffiliatePortalLayout from './apps/affiliate-portal/AffiliatePortalLayout';
import AffiliateDashboard from './apps/affiliate-portal/AffiliateDashboard';
import ReferralLinks from './apps/affiliate-portal/ReferralLinks';
import EarningsPayouts from './apps/affiliate-portal/EarningsPayouts';
import MarketingAssets from './apps/affiliate-portal/MarketingAssets';

function AppContent() {
  const { currentRole, setRole, currentLanguage, setLanguage } = useAppState();

  // Teacher navigation state
  const [teacherTab, setTeacherTab] = useState('dashboard');

  // Admin & Affiliate navigation state
  const [adminTab, setAdminTab] = useState('dashboard');
  const [affiliateTab, setAffiliateTab] = useState('dashboard');

  // Student portal navigation & viewing sub-states
  const [studentTab, setStudentTab] = useState('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<ExamSubmission | undefined>(undefined);

  // Floating controller state (developer debug panel)
  const [showDevPanel, setShowDevPanel] = useState(true);

  // Reset demo storage helper
  const handleResetData = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ab_')) keysToRemove.push(key);
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* 0. Level 0: Admin Platform */}
      {currentRole === 'admin' && (
        <AdminDashboardLayout activeTab={adminTab} setActiveTab={setAdminTab}>
          {adminTab === 'dashboard' && <AdminHome onNavigate={setAdminTab} />}
          {adminTab === 'teachers' && <TeachersManager />}
          {adminTab === 'students' && <GlobalStudentsManager />}
          {adminTab === 'affiliates' && <AffiliatesDashboard />}
          {adminTab === 'affiliates-list' && <AffiliatesManager />}
          {adminTab === 'affiliates-payouts' && <PayoutsManager />}
        </AdminDashboardLayout>
      )}

      {/* 1. Level 1: Public Marketing & Auth */}
      {currentRole === 'visitor' && <LandingPage />}
      
      {currentRole === 'onboarding' && <OnboardingWizard />}

      {/* 1.5. Level 1.5: Teacher's Custom Landing Page */}
      {currentRole === 'student-landing' && <TeacherLandingPage />}

      {/* 2. Level 2: Teacher Dashboard */}
      {currentRole === 'teacher' && (
        <TeacherDashboardLayout activeTab={teacherTab} setActiveTab={setTeacherTab}>
          {teacherTab === 'dashboard' && <DashboardHome onNavigate={setTeacherTab} />}
          {teacherTab === 'content' && <ContentManager />}
          {teacherTab === 'question-bank' && <QuestionBank />}
          {teacherTab === 'exams' && <ExamsManager />}
          {teacherTab === 'students' && <StudentsManager />}
          {teacherTab === 'grading' && <GradingManager />}
          {teacherTab === 'activation' && <ActivationManager />}
          {teacherTab === 'calendar' && <CalendarView />}
          {teacherTab === 'finance' && <FinanceDashboard />}
          {teacherTab === 'analytics' && <AnalyticsDashboard />}
          {teacherTab === 'settings' && <SettingsPanel />}
        </TeacherDashboardLayout>
      )}

      {/* 3. Level 3: Student Portal */}
      {currentRole === 'student' && (
        <StudentPortalLayout activeTab={studentTab} setActiveTab={(tab) => {
          setStudentTab(tab);
          setActiveLesson(null);
          setActiveExam(null);
        }}>
          {activeLesson ? (
            <LessonViewer 
              lesson={activeLesson} 
              onBack={() => setActiveLesson(null)} 
            />
          ) : activeExam ? (
            <ExamTaker 
              exam={activeExam} 
              onSubmit={(sub) => {
                setActiveSubmission(sub);
                setStudentTab('exams');
                setActiveExam(null);
              }}
            />
          ) : (
            <>
              {studentTab === 'dashboard' && (
                <StudentDashboard 
                  onOpenLesson={setActiveLesson} 
                  onOpenExam={setActiveExam}
                  onNavigate={setStudentTab}
                />
              )}
              {studentTab === 'lessons' && (
                <StudentDashboard 
                  onOpenLesson={setActiveLesson} 
                  onOpenExam={setActiveExam}
                  onNavigate={setStudentTab}
                />
              )}
              {studentTab === 'exams' && (
                <ExamResults 
                  submission={activeSubmission} 
                  onNavigate={setStudentTab}
                />
              )}
            </>
          )}
        </StudentPortalLayout>
      )}

      {/* 4. Affiliate Portal */}
      {currentRole === 'affiliate' && (
        <AffiliatePortalLayout activeTab={affiliateTab} setActiveTab={setAffiliateTab}>
          {affiliateTab === 'dashboard' && <AffiliateDashboard />}
          {affiliateTab === 'links' && <ReferralLinks />}
          {affiliateTab === 'earnings' && <EarningsPayouts />}
          {affiliateTab === 'marketing' && <MarketingAssets />}
        </AffiliatePortalLayout>
      )}

      {/* Floating Developer/Auditor control center (Prototype Switcher) */}
      <div className="fixed bottom-4 left-4 z-50">
        {showDevPanel ? (
          <div className="bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 max-w-xs text-xs text-left animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <DevIcon className="h-4 w-4 text-indigo-400" />
                <span>Prototype Controller</span>
              </span>
              <button 
                onClick={() => setShowDevPanel(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Role switch list */}
            <div className="space-y-1.5">
              <span className="font-bold text-[9px] uppercase tracking-widest text-slate-500">Jump User Role</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => setRole('visitor')}
                  className={`px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'visitor' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Visitor Site
                </button>
                <button 
                  onClick={() => setRole('onboarding')}
                  className={`px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'onboarding' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Onboarding
                </button>
                <button 
                  onClick={() => setRole('teacher')}
                  className={`px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'teacher' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Teacher DB
                </button>
                <button 
                  onClick={() => setRole('student')}
                  className={`px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'student' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Student Portal
                </button>
                <button 
                  onClick={() => setRole('student-landing')}
                  className={`col-span-2 px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'student-landing' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Student Landing
                </button>
                <button 
                  onClick={() => setRole('admin')}
                  className={`col-span-2 px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'admin' ? 'bg-rose-600 border-rose-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Admin Platform
                </button>
                <button 
                  onClick={() => setRole('affiliate')}
                  className={`col-span-2 px-2 py-1.5 rounded-lg border font-bold text-center transition-colors ${
                    currentRole === 'affiliate' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Affiliate Portal
                </button>
              </div>
            </div>

            {/* Language toggle selector */}
            <div className="space-y-1">
              <span className="font-bold text-[9px] uppercase tracking-widest text-slate-500">Toggle Language RTL</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg border font-bold text-center transition-colors ${
                    currentLanguage === 'en' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  English (LTR)
                </button>
                <button 
                  onClick={() => setLanguage('ar')}
                  className={`px-2 py-1 rounded-lg border font-bold text-center transition-colors ${
                    currentLanguage === 'ar' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  العربية (RTL)
                </button>
              </div>
            </div>

            {/* Reset data */}
            <button
              onClick={handleResetData}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700/60"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Mock Database</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowDevPanel(true)}
            className="bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white p-3 rounded-full shadow-2xl flex items-center justify-center"
            title="Open developer controller"
          >
            <DevIcon className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
