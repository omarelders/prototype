const exams = Array.from({ length: 1000 }, (_, i) => ({ id: `e-${i}`, title: `Exam ${i}` }));
const submissions = Array.from({ length: 5000 }, (_, i) => ({ id: `s-${i}`, examId: `e-${Math.floor(Math.random() * 1000)}` }));

console.time("O(N*M) Find");
for (let i = 0; i < 100; i++) {
  submissions.map(sub => exams.find(e => e.id === sub.examId));
}
console.timeEnd("O(N*M) Find");

console.time("Build Dict");
const examDict = {};
exams.forEach(e => { examDict[e.id] = e; });
console.timeEnd("Build Dict");

console.time("O(N) Lookup");
for (let i = 0; i < 100; i++) {
  submissions.map(sub => examDict[sub.examId]);
}
console.timeEnd("O(N) Lookup");
