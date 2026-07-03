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
  questionIds: string[];
  duration: number; // minutes
  attempts: number;
  targetClass: string;
  targetGrade?: string; // e.g. Grade 1, Grade 2, Grade 3
  activationDate: string;
  status: 'active' | 'scheduled' | 'completed';
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
  score?: number;
  status: 'submitted' | 'graded';
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

