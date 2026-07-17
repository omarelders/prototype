import { performance } from 'perf_hooks';

// Setup mock data
const NUM_AFFILIATES = 10000;
const NUM_PAYOUTS = 50000;

const affiliates = Array.from({ length: NUM_AFFILIATES }).map((_, i) => ({
  id: `aff-${i}`,
  name: `Affiliate ${i}`,
  referralCode: `REF${i}`
}));

const affiliatePayouts = Array.from({ length: NUM_PAYOUTS }).map((_, i) => ({
  id: `pay-${i}`,
  affiliateId: `aff-${i % NUM_AFFILIATES}`,
  amount: 100,
  period: '2023-10',
  method: 'Bank Transfer',
  status: 'pending'
}));

const searchTerm = 'Affiliate 999';
const statusFilter = 'all';

// BASELINE
const startBaseline = performance.now();
const filteredPayouts = affiliatePayouts.filter(p => {
  const affiliate = affiliates.find(a => a.id === p.affiliateId);
  const matchesSearch = affiliate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
  const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
  return matchesSearch && matchesStatus;
});

const renderedBaseline = filteredPayouts.map(payout => {
  const affiliate = affiliates.find(a => a.id === payout.affiliateId);
  return { ...payout, affiliateName: affiliate?.name };
});
const endBaseline = performance.now();
console.log(`Baseline time: ${(endBaseline - startBaseline).toFixed(2)} ms`);

// OPTIMIZED
const startOptimized = performance.now();
const affiliateMap = new Map();
for (const a of affiliates) {
  affiliateMap.set(a.id, a);
}

const filteredPayoutsOpt = affiliatePayouts.filter(p => {
  const affiliate = affiliateMap.get(p.affiliateId);
  const matchesSearch = affiliate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
  const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
  return matchesSearch && matchesStatus;
});

const renderedOptimized = filteredPayoutsOpt.map(payout => {
  const affiliate = affiliateMap.get(payout.affiliateId);
  return { ...payout, affiliateName: affiliate?.name };
});
const endOptimized = performance.now();
console.log(`Optimized time: ${(endOptimized - startOptimized).toFixed(2)} ms`);
