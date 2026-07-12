import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Question, 
  QuestionFolder, 
  Lesson, 
  ClassGroup, 
  Exam, 
  Student, 
  ExamSubmission, 
  CalendarEvent, 
  Coupon, 
  Announcement, 
  SupportTicket,
  WalletTransaction,
  TeacherAccount,
  Affiliate,
  Referral,
  CommissionTier,
  AffiliatePayout,
  PlatformTransaction
} from '../types';

interface AppStateContextProps {
  currentLanguage: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  currentRole: 'visitor' | 'onboarding' | 'teacher' | 'student' | 'student-landing' | 'admin' | 'affiliate';
  setRole: (role: 'visitor' | 'onboarding' | 'teacher' | 'student' | 'student-landing' | 'admin' | 'affiliate') => void;
  
  // Custom teacher levels
  activeLevels: string[];
  setActiveLevels: (levels: string[]) => void;
  
  // Teacher branding & profile
  teacherProfile: {
    name: string;
    email: string;
    specialty: string;
    bio: string;
    logoUrl?: string;
    themeColors: { primary: string; secondary: string };
    studentPrice: number;
    paymentInstructions: string;
    subdomain: string;
  };
  updateTeacherProfile: (profile: Partial<AppStateContextProps['teacherProfile']>) => void;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;

  // Entities
  folders: QuestionFolder[];
  questions: Question[];
  lessons: Lesson[];
  classes: ClassGroup[];
  exams: Exam[];
  students: Student[];
  submissions: ExamSubmission[];
  coupons: Coupon[];
  announcements: Announcement[];
  tickets: SupportTicket[];
  events: CalendarEvent[];

  // Platform & Affiliate Entities
  globalTeachers: TeacherAccount[];
  affiliates: Affiliate[];
  referrals: Referral[];
  commissionTiers: CommissionTier[];
  affiliatePayouts: AffiliatePayout[];
  platformTransactions: PlatformTransaction[];

  // Wallet
  walletBalance: number;
  walletTransactions: WalletTransaction[];

  // Mutators
  addFolder: (folder: QuestionFolder) => void;
  deleteFolder: (folderId: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (lessonId: string) => void;
  addClass: (cls: ClassGroup) => void;
  updateClass: (cls: ClassGroup) => void;
  updateLessonGroupLinks: (payload: { lessonId?: string; groupId?: string; linkedIds: string[] }) => void;
  addExam: (exam: Exam) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  confirmStudentPayment: (studentId: string) => void;
  rejectStudentPayment: (studentId: string) => void;
  addSubmission: (submission: ExamSubmission) => void;
  updateSubmission: (submission: ExamSubmission) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: string) => void;
  addAnnouncement: (announcement: Announcement) => void;
  addTicketMessage: (ticketId: string, message: { sender: 'teacher' | 'support'; text: string; time: string }) => void;
  addTicket: (ticket: SupportTicket) => void;
  addEvent: (event: CalendarEvent) => void;

  // Platform Mutators
  addGlobalTeacher: (teacher: TeacherAccount) => void;
  updateGlobalTeacher: (teacher: TeacherAccount) => void;
  addAffiliate: (affiliate: Affiliate) => void;
  updateAffiliate: (affiliate: Affiliate) => void;
  addReferral: (referral: Referral) => void;
  updateReferral: (referral: Referral) => void;
  addCommissionTier: (tier: CommissionTier) => void;
  updateCommissionTier: (tier: CommissionTier) => void;
  addAffiliatePayout: (payout: AffiliatePayout) => void;
  updateAffiliatePayout: (payout: AffiliatePayout) => void;
  addPlatformTransaction: (transaction: PlatformTransaction) => void;

  // Wallet Mutators
  depositToWallet: (amount: number, method: string) => void;
  activateStudentWithWallet: (studentId: string, cost: number) => boolean;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

// Initial Mock Data
const defaultFolders: QuestionFolder[] = [
  { id: 'f-chem-1', name: 'Unit 1: Organic Chemistry', parentId: null, level: 'g3' },
  { id: 'f-phys-1', name: 'Unit 1: Electric Currents', parentId: null, level: 'g3' },
  { id: 'f-arab-1', name: 'Unit 1: Arabic Grammar (النحو)', parentId: null, level: 'g1' },
  { id: 'f-g1-chem', name: 'الوحدة الأولى: الكيمياء مركز العلوم', parentId: null, level: 'g1' },
  { id: 'f-g2-math', name: 'الوحدة الأولى: الجبر وحساب المثلثات', parentId: null, level: 'g2' },
  { id: 'f-g2-phys', name: 'الوحدة الأولى: الضوء والحرارة', parentId: null, level: 'g2' }
];

const defaultQuestions: Question[] = [
  {
    id: 'q-1',
    title: 'What is the molecular structure of Benzene ($C_6H_6$) according to Kekulé?',
    type: 'mcq',
    difficulty: 'medium',
    options: [
      'A planar ring of six carbon atoms with alternating single and double bonds',
      'A chair conformation of six carbon atoms with single bonds',
      'A regular hexagon with delocalized electrons represented by a circle',
      'A linear chain of six carbon atoms with double bonds'
    ],
    correctOption: 0,
    folderId: 'f-chem-1'
  },
  {
    id: 'q-2',
    title: 'Calculate the equivalent resistance of three resistors ($R_1 = 3\\,\\Omega$, $R_2 = 6\\,\\Omega$, $R_3 = 9\\,\\Omega$) connected in parallel.',
    type: 'mcq',
    difficulty: 'hard',
    options: [
      '$1.64\\,\\Omega$',
      '$18\\,\\Omega$',
      '$2\\,\\Omega$',
      '$0.61\\,\\Omega$'
    ],
    correctOption: 0,
    folderId: 'f-phys-1'
  },
  {
    id: 'q-3',
    title: "State Newton's Second Law of Motion in terms of momentum, and explain why it is more general than $F = ma$.",
    type: 'essay',
    difficulty: 'medium',
    modelAnswer: "Newton's Second Law states that the rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction in which the force acts: $F = \\frac{dp}{dt}$. This is more general than $F=ma$ because it accounts for systems with variable mass (e.g. rockets or relativistic particles) where mass is not constant.",
    folderId: 'f-phys-1'
  },
  {
    id: 'q-4',
    title: 'ما هو إعراب كلمة "العلمُ" في الجملة التالية: "إنَّ العلمَ نورٌ"؟',
    type: 'mcq',
    difficulty: 'easy',
    options: [
      'مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة',
      'اسم إنّ منصوب وعلامة نصبه الفتحة الظاهرة',
      'خبر إنّ مرفوع وعلامة رفعه الضمة الظاهرة',
      'فاعل مرفوع وعلامة رفعه الضمة الظاهرة'
    ],
    correctOption: 1,
    folderId: 'f-arab-1'
  },
  {
    id: 'q-g1-chem-1',
    title: 'أي من فروع علم الكيمياء يدرس التلوث الكيميائي للبيئة وطرق معالجته؟',
    type: 'mcq',
    difficulty: 'easy',
    options: [
      'الكيمياء البيئية',
      'الكيمياء الحيوية',
      'الكيمياء التحليلية',
      'الكيمياء العضوية'
    ],
    correctOption: 0,
    folderId: 'f-g1-chem'
  },
  {
    id: 'q-g2-math-1',
    title: 'أوجد مجموعة حل المعادلة التالية في ح: $3^{x+1} + 3^x = 36$',
    type: 'mcq',
    difficulty: 'medium',
    options: [
      '$x = 2$',
      '$x = 3$',
      '$x = 1$',
      '$x = 4$'
    ],
    correctOption: 0,
    folderId: 'f-g2-math'
  },
  {
    id: 'q-g2-phys-1',
    title: 'وضح بشرح موجز شروط حدوث الانعكاس الكلي للضوء، مع كتابة علاقة الزاوية الحرجة $\\theta_c$.',
    type: 'essay',
    difficulty: 'medium',
    modelAnswer: 'شروط حدوث الانعكاس الكلي:\n1. انتقال الضوء من وسط أكبر كثافة ضوئية (معامل انكساره أكبر $n_1$) إلى وسط أقل كثافة ضوئية (معامل انكساره أقل $n_2$).\n2. أن تكون زاوية السقوط في الوسط الأول أكبر من الزاوية الحرجة لهذا الوسط ($\\theta > \\theta_c$).\n\nالعلاقة الرياضية للزاوية الحرجة بين الوسطين هي:\n$$\\sin(\\theta_c) = \\frac{n_2}{n_1}$$',
    folderId: 'f-g2-phys'
  }
];

const defaultLessons: Lesson[] = [
  {
    id: 'l-1',
    title: 'Introduction to Organic Chemistry & Benzene Structure',
    description: 'Learn the basic configurations of organic carbon structures, functional groups, and the famous aromatic structure of Benzene ring ($C_6H_6$).',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    status: 'published',
    targetClass: 'c-1',
    sections: [
      {
        id: 's-1-1',
        type: 'video',
        videoUrl: 'https://iframe.mediadelivery.net/play/12345/abcde-6789',
        videoDescription: 'A comprehensive 25-minute guide to hydrocarbon classification and Kekulé structure.'
      },
      {
        id: 's-1-2',
        type: 'reading',
        readingContent: '### Benzene ring hybridization\nEach carbon atom in Benzene is $sp^2$ hybridized. This creates 3 $\\sigma$-bonds for each carbon (two with adjacent carbons, one with a hydrogen). The remaining unhybridized $p$-orbital is perpendicular to the ring, forming delocalized $\\pi$-bonds above and below the ring structure.\n\n### Stability (Resonance Energy)\nDue to electron delocalization, Benzene exhibits high resonance stability (about $152\\text{ kJ/mol}$). It prefers substitution reactions rather than addition reactions, which would disrupt this stable aromatic system.'
      },
      {
        id: 's-1-3',
        type: 'exercises',
        exerciseQuestionIds: ['q-1']
      }
    ],
    grade: 'Grade 1',
    subject: 'Chemistry'
  },
  {
    id: 'l-2',
    title: 'Electric Currents & Ohm\'s Law',
    description: 'Master electric circuits, current definition, electromotive force, resistance, and calculating series and parallel resistance circuits.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    status: 'published',
    targetClass: 'c-1',
    sections: [
      {
        id: 's-2-1',
        type: 'video',
        videoUrl: 'https://iframe.mediadelivery.net/play/12345/phys-current',
        videoDescription: 'Solving complex resistor circuits step-by-step using parallel and series formulas.'
      },
      {
        id: 's-2-2',
        type: 'reading',
        readingContent: '### Ohm\'s Law\nOhm\'s Law states that the current ($I$) flowing through a conductor is directly proportional to the potential difference ($V$) across its ends, provided the temperature remains constant:\n\n$$V = I \\times R$$\n\nWhere $R$ is the electrical resistance of the material.'
      },
      {
        id: 's-2-3',
        type: 'exercises',
        exerciseQuestionIds: ['q-2', 'q-3']
      }
    ],
    grade: 'Grade 1',
    subject: 'Physics'
  }
];

const defaultClasses: ClassGroup[] = [
  {
    id: 'c-1',
    name: 'Grade 12 - Scientific Section Group A',
    description: 'Highschool Third Year (الثانوية العامة) physics and chemistry curriculum group.',
    lessonIds: ['l-1', 'l-2'],
    examIds: ['e-1'],
    grade: 'Grade 1'
  }
];

const defaultExams: Exam[] = [
  {
    id: 'e-1',
    title: 'Unit 1 Midterm Exam: Circuits & Benzene',
    questionIds: ['q-1', 'q-2', 'q-3'],
    duration: 30, // 30 mins
    attempts: 2,
    targetClass: 'c-1',
    activationDate: '2026-06-30T10:00:00Z',
    status: 'active'
  }
];

const defaultStudents: Student[] = [
  {
    id: 'st-1',
    name: 'Ahmed Gamal',
    email: 'ahmed.gamal@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 75,
    lastSeen: '2026-06-30T12:05:00Z'
  },
  {
    id: 'st-2',
    name: 'Mona Aly',
    email: 'mona.aly22@yahoo.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 40,
    lastSeen: '2026-06-29T18:44:00Z'
  },
  {
    id: 'st-3',
    name: 'Youssef Ibrahim',
    email: 'youssef.ib2008@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'pending',
    progress: 0,
    lastSeen: '2026-06-30T09:12:00Z',
    paymentProofUrl: 'vodafone_cash_receipt.png',
    paymentAmount: 150,
    paymentDate: '2026-06-30'
  },
  {
    id: 'st-4',
    name: 'Sara Ahmed',
    email: 'sara.ahmed@outlook.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'pending',
    progress: 0,
    lastSeen: '2026-07-01T14:22:00Z',
    paymentProofUrl: 'vodafone_cash_receipt.png',
    paymentAmount: 150,
    paymentDate: '2026-07-01'
  },
  {
    id: 'st-5',
    name: 'Mazen Khaled',
    email: 'mazen.khaled@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'pending',
    progress: 0,
    lastSeen: '2026-07-02T10:05:00Z',
    paymentProofUrl: 'vodafone_cash_receipt.png',
    paymentAmount: 150,
    paymentDate: '2026-07-02'
  },
  {
    id: 'st-6',
    name: 'Mariam Hassan',
    email: 'mariam.hassan@yahoo.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'pending',
    progress: 0,
    lastSeen: '2026-07-02T18:30:00Z',
    paymentProofUrl: 'vodafone_cash_receipt.png',
    paymentAmount: 150,
    paymentDate: '2026-07-02'
  },
  {
    id: 'st-7',
    name: 'Omar Elsherif',
    email: 'omar.sherif@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'pending',
    progress: 0,
    lastSeen: '2026-07-02T22:15:00Z',
    paymentProofUrl: 'vodafone_cash_receipt.png',
    paymentAmount: 150,
    paymentDate: '2026-07-02'
  },
  {
    id: 'st-8',
    name: 'Kareem Fahmy',
    email: 'kareem.fahmy@hotmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 90,
    lastSeen: '2026-07-02T21:40:00Z'
  },
  {
    id: 'st-9',
    name: 'Hoda Mourad',
    email: 'hoda.mourad@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 65,
    lastSeen: '2026-07-01T11:10:00Z'
  },
  {
    id: 'st-10',
    name: 'Tarek Soliman',
    email: 'tarek.soliman@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 55,
    lastSeen: '2026-07-02T09:30:00Z'
  },
  {
    id: 'st-11',
    name: 'Zeinab Omar',
    email: 'zeinab.omar@yahoo.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 80,
    lastSeen: '2026-07-02T16:50:00Z'
  },
  {
    id: 'st-12',
    name: 'Farida Adel',
    email: 'farida.adel@outlook.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 30,
    lastSeen: '2026-06-30T15:20:00Z'
  },
  {
    id: 'st-13',
    name: 'Mostafa Kamel',
    email: 'mostafa.kamel@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 45,
    lastSeen: '2026-07-01T17:45:00Z'
  },
  {
    id: 'st-14',
    name: 'Hana Elwy',
    email: 'hana.elwy@gmail.com',
    classId: 'c-1',
    subscriptionType: 'monthly',
    status: 'active',
    progress: 85,
    lastSeen: '2026-07-02T23:10:00Z'
  }
];

const defaultSubmissions: ExamSubmission[] = [
  {
    id: 'sub-1',
    examId: 'e-1',
    studentId: 'st-1',
    studentName: 'Ahmed Gamal',
    answers: {
      'q-1': '0', // Correct
      'q-2': '0', // Correct
      'q-3': "Newton's Second Law says that the net force equals the rate of change of momentum, $F = dp/dt$. This is more general because if mass changes, like in a rocket, we can't just do $F=ma$, we must use the derivative of momentum." // Excellent essay answer
    },
    mcqAnswers: { 'q-1': 0, 'q-2': 0 },
    score: 12,
    status: 'graded',
    submittedAt: '2026-06-30T10:45:00Z',
    gradedDate: '2026-06-30T11:00:00Z',
    aiFeedback: {
      'q-3': 'Excellent! Correct formulation of $F=dp/dt$ and perfect reasoning about variable mass systems (like rocket propulsion).'
    },
    manualFeedback: 'Perfect job Ahmed, keep up the amazing work!'
  },
  {
    id: 'sub-2',
    examId: 'e-1',
    studentId: 'st-2',
    studentName: 'Mona Aly',
    answers: { 'q-1': '2', 'q-2': '0', 'q-3': "Newton's law relates force and momentum. F=ma is only for constant mass." },
    mcqAnswers: { 'q-1': 2, 'q-2': 0 },
    score: 7,
    status: 'graded',
    submittedAt: '2026-06-30T10:50:00Z',
    gradedDate: '2026-06-30T11:30:00Z'
  },
  {
    id: 'sub-3',
    examId: 'e-1',
    studentId: 'st-8',
    studentName: 'Kareem Fahmy',
    answers: { 'q-1': '0', 'q-2': '1', 'q-3': "F = dp/dt is the rate of change of momentum." },
    mcqAnswers: { 'q-1': 0, 'q-2': 1 },
    score: 8.5,
    status: 'graded',
    submittedAt: '2026-06-30T10:55:00Z',
    gradedDate: '2026-06-30T11:35:00Z'
  },
  {
    id: 'sub-4',
    examId: 'e-1',
    studentId: 'st-9',
    studentName: 'Hoda Mourad',
    answers: { 'q-1': '3', 'q-2': '2', 'q-3': "I don't know the exact formula, but it has to do with forces." },
    mcqAnswers: { 'q-1': 3, 'q-2': 2 },
    score: 5,
    status: 'graded',
    submittedAt: '2026-06-30T10:40:00Z',
    gradedDate: '2026-06-30T11:40:00Z'
  },
  {
    id: 'sub-5',
    examId: 'e-1',
    studentId: 'st-10',
    studentName: 'Tarek Soliman',
    answers: { 'q-1': '0', 'q-2': '0', 'q-3': "Newton stated that the external force is proportional to the rate of change of momentum, $F=dp/dt$." },
    mcqAnswers: { 'q-1': 0, 'q-2': 0 },
    score: 11,
    status: 'graded',
    submittedAt: '2026-06-30T10:48:00Z',
    gradedDate: '2026-06-30T11:45:00Z'
  },
  {
    id: 'sub-6',
    examId: 'e-1',
    studentId: 'st-11',
    studentName: 'Zeinab Omar',
    answers: { 'q-1': '0', 'q-2': '3', 'q-3': "It states that $F=dp/dt$. It applies to systems with changing mass." },
    mcqAnswers: { 'q-1': 0, 'q-2': 3 },
    score: 6.5,
    status: 'graded',
    submittedAt: '2026-06-30T10:52:00Z',
    gradedDate: '2026-06-30T11:50:00Z'
  },
  {
    id: 'sub-7',
    examId: 'e-1',
    studentId: 'st-12',
    studentName: 'Farida Adel',
    answers: { 'q-1': '1', 'q-2': '1', 'q-3': "Force equals mass times acceleration." },
    mcqAnswers: { 'q-1': 1, 'q-2': 1 },
    score: 4,
    status: 'graded',
    submittedAt: '2026-06-30T10:42:00Z',
    gradedDate: '2026-06-30T11:55:00Z'
  },
  {
    id: 'sub-8',
    examId: 'e-1',
    studentId: 'st-14',
    studentName: 'Hana Elwy',
    answers: { 'q-1': '0', 'q-2': '0', 'q-3': "Force is the derivative of momentum with respect to time: $F=dp/dt$." },
    mcqAnswers: { 'q-1': 0, 'q-2': 0 },
    score: 10,
    status: 'graded',
    submittedAt: '2026-06-30T10:47:00Z',
    gradedDate: '2026-06-30T12:00:00Z'
  },
  {
    id: 'sub-9',
    examId: 'e-1',
    studentId: 'st-13',
    studentName: 'Mostafa Kamel',
    answers: { 'q-1': '2', 'q-2': '0', 'q-3': "Newton's second law is more general as $F=dp/dt$." },
    mcqAnswers: { 'q-1': 2, 'q-2': 0 },
    score: 7.5,
    status: 'graded',
    submittedAt: '2026-06-30T10:58:00Z',
    gradedDate: '2026-06-30T12:05:00Z'
  }
];

const defaultCoupons: Coupon[] = [
  { id: 'cp-1', code: 'EGYPT50', discountPercent: 50, expiryDate: '2026-07-15', usageLimit: 100, usageCount: 24 },
  { id: 'cp-2', code: 'EXAM100', discountPercent: 100, expiryDate: '2026-07-01', usageLimit: 10, usageCount: 8 }
];

const defaultAnnouncements: Announcement[] = [
  {
    id: 'an-1',
    title: '💡 Monthly Revision Session this Friday!',
    content: 'Dear students, we will have our monthly revision session on Zoom this Friday at 6:00 PM. We will solve the hardest circuits problems and Benzene reactions. Make sure you revise Units 1 and 2.',
    date: '2026-06-29',
    attachments: [{ name: 'Revision Sheet - June.pdf', size: '1.2 MB' }]
  }
];

const defaultTickets: SupportTicket[] = [
  {
    id: 'tk-1',
    title: 'Billing issue - Student activation code',
    status: 'open',
    date: '2026-06-28',
    category: 'Billing',
    messages: [
      { sender: 'teacher', text: 'Hello, a student paid via Vodafone Cash but didn\'t receive their email confirmation code immediately. Can you check?', time: '11:00 AM' },
      { sender: 'support', text: 'Hi Professor! Yes, we see the payment has been logged but requires your manual approval in the "Students" page under "Pending Activation". Once you click confirm, their portal opens immediately.', time: '11:30 AM' }
    ]
  }
];

const defaultEvents: CalendarEvent[] = [
  { id: 'ev-1', title: 'Aromatic Benzene Class', type: 'lesson', date: '2026-06-25', details: 'Chemistry Unit 1 Lesson' },
  { id: 'ev-2', title: 'Ohm\'s Law Circuits', type: 'lesson', date: '2026-06-28', details: 'Physics Unit 1 Lesson' },
  { id: 'ev-3', title: 'Unit 1 Midterm Exam', type: 'exam', date: '2026-06-30', details: 'Duration: 30 minutes.' },
  { id: 'ev-4', title: 'Zoom Live Revision', type: 'announcement', date: '2026-07-03', details: 'Live stream solve session' }
];

const defaultWalletTransactions: WalletTransaction[] = [
  { id: 'wt-1', type: 'deposit', amount: 500, date: '2026-06-20', paymentMethod: 'Credit Card' },
  { id: 'wt-2', type: 'activation', amount: 150, date: '2026-06-25', studentName: 'Ahmed Gamal' },
  { id: 'wt-3', type: 'activation', amount: 150, date: '2026-06-29', studentName: 'Mona Aly' },
];

const defaultGlobalTeachers: TeacherAccount[] = [
  { id: 't-1', name: 'Dr. Mohamed Shaker', email: 'dr.shaker.science@gmail.com', specialty: 'Physics & Chemistry', subscriptionTier: 'pro', status: 'active', studentCount: 120, revenueGenerated: 18000, joinDate: '2025-01-15' },
  { id: 't-2', name: 'Eng. Ahmed Tarek', email: 'ahmed.math@gmail.com', specialty: 'Mathematics', subscriptionTier: 'basic', status: 'active', studentCount: 45, revenueGenerated: 4500, joinDate: '2025-06-20' },
  { id: 't-3', name: 'Mr. Sayed Ali', email: 'sayed.arabic@yahoo.com', specialty: 'Arabic', subscriptionTier: 'enterprise', status: 'active', studentCount: 350, revenueGenerated: 52500, joinDate: '2024-09-01' },
];

const defaultAffiliates: Affiliate[] = [
  { id: 'af-1', name: 'Kareem Mostafa', email: 'kareem.m@influencer.com', type: 'influencer', referralCode: 'KAREEM26', status: 'active', tierId: 'ct-1', joinDate: '2026-01-10' },
];

const defaultReferrals: Referral[] = [];

const defaultCommissionTiers: CommissionTier[] = [
  { id: 'ct-1', name: 'Bronze', minReferrals: 0, maxReferrals: 5, commissionPercent: 10, durationMonths: 3 },
  { id: 'ct-2', name: 'Silver', minReferrals: 6, maxReferrals: 20, commissionPercent: 15, durationMonths: 6 },
  { id: 'ct-3', name: 'Gold', minReferrals: 21, maxReferrals: null, commissionPercent: 20, durationMonths: 12 },
];

const defaultAffiliatePayouts: AffiliatePayout[] = [];
const defaultPlatformTransactions: PlatformTransaction[] = [];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global View Settings
  const [currentLanguage, setLanguage] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('ab_lang') as 'en' | 'ar') || 'en';
  });
  const [currentRole, setRole] = useState<'visitor' | 'onboarding' | 'teacher' | 'student' | 'student-landing' | 'admin' | 'affiliate'>(() => {
    const saved = localStorage.getItem('ab_role');
    if (saved === 'onboarding' || saved === 'teacher' || saved === 'student' || saved === 'student-landing' || saved === 'admin' || saved === 'affiliate') return saved;
    return 'visitor';
  });

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('ab_wallet_balance');
    return saved ? Number(saved) : 350; // default balance (500 deposit - 150 activation - 150 activation + 150 extra)
  });

  // Onboarding step
  const [onboardingStep, setOnboardingStep] = useState<number>(() => {
    return Number(localStorage.getItem('ab_onboard_step') || '1');
  });

  // Custom teacher levels
  const [activeLevels, setActiveLevels] = useState<string[]>(() => {
    const saved = localStorage.getItem('ab_active_levels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // use default
      }
    }
    return ['g1', 'g2', 'g3']; // default secondary levels
  });

  // Teacher Profile
  const [teacherProfile, setTeacherProfileState] = useState(() => {
    const saved = localStorage.getItem('ab_teacher_profile');
    if (saved) { try { return JSON.parse(saved); } catch { /* corrupted data */ } }
    return {
      name: 'Dr. Mohamed Shaker',
      email: 'dr.shaker.science@gmail.com',
      specialty: 'Physics & Chemistry',
      bio: 'Expert High School science teacher with over 15 years of experience prepairing students for Thanaweya Amma success in Egypt.',
      logoUrl: undefined,
      themeColors: { primary: '#16213e', secondary: '#4361ee' },
      studentPrice: 150, // 150 EGP per month
      paymentInstructions: 'Vodafone Cash: 01012345678 or Instapay: shaker@instapay',
      subdomain: 'shaker-science'
    };
  });

  // State arrays helper loads
  const loadState = (key: string, defaults: any) => {
    const saved = localStorage.getItem(key);
    if (saved) { try { return JSON.parse(saved); } catch { /* corrupted data */ } }
    return defaults;
  };

  const [folders, setFolders] = useState<QuestionFolder[]>(() => loadState('ab_folders', defaultFolders));
  const [questions, setQuestions] = useState<Question[]>(() => loadState('ab_questions', defaultQuestions));
  const [lessons, setLessons] = useState<Lesson[]>(() => loadState('ab_lessons', defaultLessons));
  const [classes, setClasses] = useState<ClassGroup[]>(() => loadState('ab_classes', defaultClasses));
  const [exams, setExams] = useState<Exam[]>(() => loadState('ab_exams', defaultExams));
  const [students, setStudents] = useState<Student[]>(() => loadState('ab_students_v3', defaultStudents));
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => loadState('ab_submissions', defaultSubmissions));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadState('ab_coupons', defaultCoupons));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadState('ab_announcements', defaultAnnouncements));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => loadState('ab_tickets', defaultTickets));
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadState('ab_events', defaultEvents));
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => loadState('ab_wallet_transactions', defaultWalletTransactions));

  // Platform & Affiliate State
  const [globalTeachers, setGlobalTeachers] = useState<TeacherAccount[]>(() => loadState('ab_global_teachers', defaultGlobalTeachers));
  const [affiliates, setAffiliates] = useState<Affiliate[]>(() => loadState('ab_affiliates', defaultAffiliates));
  const [referrals, setReferrals] = useState<Referral[]>(() => loadState('ab_referrals', defaultReferrals));
  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>(() => loadState('ab_commission_tiers', defaultCommissionTiers));
  const [affiliatePayouts, setAffiliatePayouts] = useState<AffiliatePayout[]>(() => loadState('ab_affiliate_payouts', defaultAffiliatePayouts));
  const [platformTransactions, setPlatformTransactions] = useState<PlatformTransaction[]>(() => loadState('ab_platform_transactions', defaultPlatformTransactions));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ab_lang', currentLanguage);
    localStorage.setItem('ab_role', currentRole);
    localStorage.setItem('ab_onboard_step', onboardingStep.toString());
    localStorage.setItem('ab_teacher_profile', JSON.stringify(teacherProfile));
    localStorage.setItem('ab_folders', JSON.stringify(folders));
    localStorage.setItem('ab_questions', JSON.stringify(questions));
    localStorage.setItem('ab_lessons', JSON.stringify(lessons));
    localStorage.setItem('ab_classes', JSON.stringify(classes));
    localStorage.setItem('ab_exams', JSON.stringify(exams));
    localStorage.setItem('ab_students_v3', JSON.stringify(students));
    localStorage.setItem('ab_submissions', JSON.stringify(submissions));
    localStorage.setItem('ab_coupons', JSON.stringify(coupons));
    localStorage.setItem('ab_announcements', JSON.stringify(announcements));
    localStorage.setItem('ab_tickets', JSON.stringify(tickets));
    localStorage.setItem('ab_events', JSON.stringify(events));
    localStorage.setItem('ab_wallet_balance', walletBalance.toString());
    localStorage.setItem('ab_wallet_transactions', JSON.stringify(walletTransactions));
    localStorage.setItem('ab_active_levels', JSON.stringify(activeLevels));
    localStorage.setItem('ab_global_teachers', JSON.stringify(globalTeachers));
    localStorage.setItem('ab_affiliates', JSON.stringify(affiliates));
    localStorage.setItem('ab_referrals', JSON.stringify(referrals));
    localStorage.setItem('ab_commission_tiers', JSON.stringify(commissionTiers));
    localStorage.setItem('ab_affiliate_payouts', JSON.stringify(affiliatePayouts));
    localStorage.setItem('ab_platform_transactions', JSON.stringify(platformTransactions));
  }, [
    currentLanguage, currentRole, onboardingStep, teacherProfile,
    folders, questions, lessons, classes, exams, students,
    submissions, coupons, announcements, tickets, events, walletBalance, walletTransactions, activeLevels,
    globalTeachers, affiliates, referrals, commissionTiers, affiliatePayouts, platformTransactions
  ]);

  const updateTeacherProfile = (profile: Partial<typeof teacherProfile>) => {
    setTeacherProfileState((prev: any) => ({ ...prev, ...profile }));
  };

  // Mutators
  const addFolder = (folder: QuestionFolder) => setFolders(prev => [...prev, folder]);
  const deleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    // Orphan questions stay or can be moved, for now stay in array
  };

  const addQuestion = (question: Question) => setQuestions(prev => [...prev, question]);
  const updateQuestion = (updated: Question) => {
    setQuestions(prev => prev.map(q => q.id === updated.id ? updated : q));
  };
  const deleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const addLesson = (lesson: Lesson) => {
    setLessons(prev => [...prev, lesson]);
    // Auto-add to calendar
    addEvent({
      id: `ev-l-${lesson.id}`,
      title: lesson.title,
      type: 'lesson',
      date: new Date().toISOString().split('T')[0],
      details: lesson.description
    });
  };
  const updateLesson = (updated: Lesson) => {
    setLessons(prev => prev.map(l => l.id === updated.id ? updated : l));
  };
  const deleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(l => l.id !== lessonId));
  };

  const addClass = (cls: ClassGroup) => setClasses(prev => [...prev, cls]);
  const updateClass = (updated: ClassGroup) => {
    setClasses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };
  const updateLessonGroupLinks = (payload: { lessonId?: string; groupId?: string; linkedIds: string[] }) => {
    if (payload.lessonId) {
      const { lessonId, linkedIds } = payload;
      setClasses(prev => prev.map(cls => {
        const isLinked = linkedIds.includes(cls.id);
        const hasLesson = cls.lessonIds.includes(lessonId);
        if (isLinked && !hasLesson) {
          return { ...cls, lessonIds: [...cls.lessonIds, lessonId] };
        } else if (!isLinked && hasLesson) {
          return { ...cls, lessonIds: cls.lessonIds.filter(id => id !== lessonId) };
        }
        return cls;
      }));
    } else if (payload.groupId) {
      const { groupId, linkedIds } = payload;
      setClasses(prev => prev.map(cls => {
        if (cls.id === groupId) {
          return { ...cls, lessonIds: linkedIds };
        }
        return cls;
      }));
    }
  };

  const addExam = (exam: Exam) => {
    setExams(prev => [...prev, exam]);
    // Auto-add to calendar
    addEvent({
      id: `ev-e-${exam.id}`,
      title: exam.title,
      type: 'exam',
      date: exam.activationDate.split('T')[0],
      details: `Attempts: ${exam.attempts}, Duration: ${exam.duration} mins`
    });
  };
  const updateExam = (updated: Exam) => {
    setExams(prev => prev.map(e => e.id === updated.id ? updated : e));
  };
  const deleteExam = (examId: string) => setExams(prev => prev.filter(e => e.id !== examId));

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };
  
  const confirmStudentPayment = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'active' } : s));
  };
  const rejectStudentPayment = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId)); // delete pending
  };

  const addSubmission = (sub: ExamSubmission) => setSubmissions(prev => [...prev, sub]);
  const updateSubmission = (updated: ExamSubmission) => {
    setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const addCoupon = (coupon: Coupon) => setCoupons(prev => [...prev, coupon]);
  const deleteCoupon = (couponId: string) => setCoupons(prev => prev.filter(c => c.id !== couponId));

  const addAnnouncement = (ann: Announcement) => {
    setAnnouncements(prev => [ann, ...prev]);
    addEvent({
      id: `ev-a-${ann.id}`,
      title: ann.title,
      type: 'announcement',
      date: ann.date,
      details: ann.content
    });
  };

  const addTicketMessage = (ticketId: string, msg: { sender: 'teacher' | 'support'; text: string; time: string }) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, messages: [...t.messages, msg] } : t));
  };
  const addTicket = (ticket: SupportTicket) => setTickets(prev => [ticket, ...prev]);

  const addEvent = (event: CalendarEvent) => setEvents(prev => [...prev, event]);

  // Platform Mutators
  const addGlobalTeacher = (teacher: TeacherAccount) => setGlobalTeachers(prev => [...prev, teacher]);
  const updateGlobalTeacher = (updated: TeacherAccount) => setGlobalTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
  const addAffiliate = (affiliate: Affiliate) => setAffiliates(prev => [...prev, affiliate]);
  const updateAffiliate = (updated: Affiliate) => setAffiliates(prev => prev.map(a => a.id === updated.id ? updated : a));
  const addReferral = (referral: Referral) => setReferrals(prev => [...prev, referral]);
  const updateReferral = (updated: Referral) => setReferrals(prev => prev.map(r => r.id === updated.id ? updated : r));
  const addCommissionTier = (tier: CommissionTier) => setCommissionTiers(prev => [...prev, tier]);
  const updateCommissionTier = (updated: CommissionTier) => setCommissionTiers(prev => prev.map(t => t.id === updated.id ? updated : t));
  const addAffiliatePayout = (payout: AffiliatePayout) => setAffiliatePayouts(prev => [...prev, payout]);
  const updateAffiliatePayout = (updated: AffiliatePayout) => setAffiliatePayouts(prev => prev.map(p => p.id === updated.id ? updated : p));
  const addPlatformTransaction = (transaction: PlatformTransaction) => setPlatformTransactions(prev => [...prev, transaction]);

  const depositToWallet = (amount: number, method: string) => {
    setWalletBalance(prev => prev + amount);
    setWalletTransactions(prev => [
      {
        id: `wt-${Date.now()}`,
        type: 'deposit',
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: method
      },
      ...prev
    ]);
  };

  const activateStudentWithWallet = (studentId: string, cost: number): boolean => {
    if (walletBalance < cost) {
      return false;
    }

    setWalletBalance(prev => prev - cost);

    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : 'Unknown Student';

    setWalletTransactions(prev => [
      {
        id: `wt-${Date.now()}`,
        type: 'activation',
        amount: cost,
        date: new Date().toISOString().split('T')[0],
        studentName
      },
      ...prev
    ]);

    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: 'active' } : s));
    return true;
  };

  return (
    <AppStateContext.Provider value={{
      currentLanguage, setLanguage,
      currentRole, setRole,
      teacherProfile, updateTeacherProfile,
      onboardingStep, setOnboardingStep,
      activeLevels, setActiveLevels,
      folders, questions, lessons, classes, exams, students, submissions, coupons, announcements, tickets, events,
      walletBalance, walletTransactions,
      globalTeachers, affiliates, referrals, commissionTiers, affiliatePayouts, platformTransactions,
      addFolder, deleteFolder, addQuestion, updateQuestion, deleteQuestion,
      addLesson, updateLesson, deleteLesson, addClass, updateClass, updateLessonGroupLinks,
      addExam, updateExam, deleteExam,
      addStudent, updateStudent, confirmStudentPayment, rejectStudentPayment,
      addSubmission, updateSubmission, addCoupon, deleteCoupon, addAnnouncement, addTicketMessage, addTicket, addEvent,
      addGlobalTeacher, updateGlobalTeacher, addAffiliate, updateAffiliate, addReferral, updateReferral, addCommissionTier, updateCommissionTier, addAffiliatePayout, updateAffiliatePayout, addPlatformTransaction,
      depositToWallet, activateStudentWithWallet
    }}>
      <div dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} className={currentLanguage === 'ar' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
};
