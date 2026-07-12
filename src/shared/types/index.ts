export interface Question {
  id: string;
  title: string;
  type: 'mcq' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[]; // for MCQ
  correctOption?: number; // 0, 1, 2... for MCQ
  modelAnswer?: string; // for Essay
  folderId: string;
  grade?: string; // e.g. Grade 1, Grade 2, Grade 3
  points?: number; // Point value for weighted scoring
  required?: boolean; // Whether the question must be answered
  order?: number; // Position index within an exam
}

export interface QuestionFolder {
  id: string;
  name: string;
  parentId: string | null;
  level?: string; // 'g1', 'g2', 'g3', 'prep1', 'prep2', 'prep3'...
}

export interface LessonSection {
  id: string;
  type: 'video' | 'reading' | 'exercises';
  videoUrl?: string;
  videoDescription?: string;
  readingContent?: string;
  exerciseQuestionIds?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  status: 'published' | 'draft' | 'scheduled';
  activationDate?: string;
  targetClass: string;
  sections: LessonSection[];
  grade?: 'Grade 1' | 'Grade 2' | 'Grade 3';
  subject?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  description: string;
  lessonIds: string[];
  examIds: string[];
  grade?: 'Grade 1' | 'Grade 2' | 'Grade 3';
}

export interface Exam {
  id: string;
  title: string;
  description?: string; // Form description
  questionIds: string[];
  duration: number; // minutes
  attempts: number;
  targetClass: string;
  targetGrade?: string; // e.g. Grade 1, Grade 2, Grade 3
  activationDate: string;
  status: 'active' | 'scheduled' | 'completed';
  shuffleQuestions?: boolean; // Randomize question order
  showResults?: 'immediately' | 'after_grading' | 'never'; // When to show results
  passingScore?: number; // Optional passing percentage threshold
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  subscriptionType: 'free' | 'monthly' | 'yearly';
  status: 'active' | 'pending';
  progress: number;
  lastSeen: string;
  paymentProofUrl?: string;
  paymentAmount?: number;
  paymentDate?: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string>; // questionId -> studentAnswer
  mcqAnswers?: Record<string, number>; // Separate MCQ answers as numeric indices
  score?: number;
  status: 'submitted' | 'graded';
  submittedAt?: string; // Timestamp of submission
  gradedDate?: string;
  aiFeedback?: Record<string, string>; // questionId -> feedback explanation
  manualFeedback?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'lesson' | 'exam' | 'announcement';
  date: string; // YYYY-MM-DD
  details?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  attachments?: { name: string; size: string }[];
}

export interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'closed';
  date: string;
  category: string;
  messages: { sender: 'teacher' | 'support'; text: string; time: string }[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'activation';
  amount: number;
  date: string;
  studentName?: string;
  paymentMethod?: string;
}

// --- Platform & Affiliate Types ---

export interface TeacherAccount {
  id: string;
  name: string;
  email: string;
  specialty: string;
  subscriptionTier: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  studentCount: number;
  revenueGenerated: number;
  joinDate: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  type: 'teacher' | 'influencer' | 'student';
  referralCode: string;
  status: 'active' | 'pending' | 'suspended';
  tierId: string;
  joinDate: string;
  commissionRate?: number;
}

export interface Referral {
  id: string;
  affiliateId: string;
  referredTeacherId: string;
  referredUserId?: string;
  signupDate: string;
  date?: string;
  status: 'pending' | 'converted' | 'expired' | 'paid';
  conversionDate?: string;
  commissionEarned: number;
}

export interface CommissionTier {
  id: string;
  name: string; // e.g. Bronze, Silver, Gold
  minReferrals: number;
  maxReferrals: number | null;
  commissionPercent: number;
  durationMonths: number; // e.g., 3 months
}

export interface AffiliatePayout {
  id: string;
  affiliateId: string;
  amount: number;
  period: string; // e.g., "2026-07"
  status: 'pending' | 'processing' | 'paid';
  method: string;
  processedDate?: string;
}

export interface PlatformTransaction {
  id: string;
  teacherId: string;
  amount: number;
  date: string;
  type: 'subscription' | 'commission_payout' | 'refund';
  status: 'completed' | 'pending' | 'failed';
}
