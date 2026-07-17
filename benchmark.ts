const NUM_QUESTIONS = 5000;
const NUM_SUBMISSIONS = 1000;
const ANSWERS_PER_SUBMISSION = 100;

interface Question {
  id: string;
  type: string;
  title: string;
  correctOption: string;
}

interface Submission {
  id: string;
  mcqAnswers: Record<string, string>;
}

console.log(`Generating data: ${NUM_QUESTIONS} questions, ${NUM_SUBMISSIONS} submissions (${ANSWERS_PER_SUBMISSION} answers each)...`);

const questions: Question[] = Array.from({ length: NUM_QUESTIONS }).map((_, i) => ({
  id: `q-${i}`,
  type: i % 2 === 0 ? 'mcq' : 'essay',
  title: `Question ${i}`,
  correctOption: 'A',
}));

const submissions: Submission[] = Array.from({ length: NUM_SUBMISSIONS }).map((_, i) => {
  const mcqAnswers: Record<string, string> = {};
  for (let j = 0; j < ANSWERS_PER_SUBMISSION; j++) {
    const qId = `q-${Math.floor(Math.random() * NUM_QUESTIONS)}`;
    mcqAnswers[qId] = Math.random() > 0.5 ? 'A' : 'B';
  }
  return { id: `sub-${i}`, mcqAnswers };
});

function originalLogic() {
  const stats: Record<string, { correct: number; total: number; title: string }> = {};
  questions.forEach(q => {
    if (q.type !== 'mcq') return;
    stats[q.id] = { correct: 0, total: 0, title: q.title };
  });
  submissions.forEach(sub => {
    if (!sub.mcqAnswers) return;
    Object.entries(sub.mcqAnswers).forEach(([qId, answer]) => {
      const q = questions.find(qq => qq.id === qId);
      if (!q || q.type !== 'mcq') return;
      if (!stats[qId]) stats[qId] = { correct: 0, total: 0, title: q.title };
      stats[qId].total++;
      if (q.correctOption === answer) stats[qId].correct++;
    });
  });
  return stats;
}

function optimizedLogic() {
  const stats: Record<string, { correct: number; total: number; title: string }> = {};
  const questionsById = new Map<string, Question>();

  questions.forEach(q => {
    questionsById.set(q.id, q);
    if (q.type === 'mcq') {
      stats[q.id] = { correct: 0, total: 0, title: q.title };
    }
  });

  submissions.forEach(sub => {
    if (!sub.mcqAnswers) return;
    Object.entries(sub.mcqAnswers).forEach(([qId, answer]) => {
      const q = questionsById.get(qId);
      if (!q || q.type !== 'mcq') return;
      if (!stats[qId]) stats[qId] = { correct: 0, total: 0, title: q.title };
      stats[qId].total++;
      if (q.correctOption === answer) stats[qId].correct++;
    });
  });
  return stats;
}

console.log('Running original...');
const start1 = performance.now();
originalLogic();
const end1 = performance.now();
const timeOriginal = end1 - start1;
console.log(`Original: ${timeOriginal.toFixed(2)} ms`);

console.log('Running optimized...');
const start2 = performance.now();
optimizedLogic();
const end2 = performance.now();
const timeOptimized = end2 - start2;
console.log(`Optimized: ${timeOptimized.toFixed(2)} ms`);

console.log(`Improvement: ${(timeOriginal / timeOptimized).toFixed(2)}x faster`);
