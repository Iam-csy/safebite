
const calculateHygieneScore = ({
  cleanlinessScore = 0,    // 0-100
  foodStorageScore = 0,    // 0-100
  staffHygieneScore = 0,   // 0-100
  customerReportScore = 0, // 0-100 (100 = no complaints)
  inspectionScore = 0      
}) => {
  const weighted =
    (cleanlinessScore * 0.30) +
    (foodStorageScore * 0.25) +
    (staffHygieneScore * 0.20) +
    (customerReportScore * 0.15) +
    (inspectionScore * 0.10);

  return Math.round(weighted);
};

const getBadge = (score) => {
  if (score >= 85) return { label: 'Gold Safe', color: '#F59E0B', emoji: '🥇' };
  if (score >= 65) return { label: 'Silver Safe', color: '#9CA3AF', emoji: '🥈' };
  return { label: 'Needs Improvement', color: '#EF4444', emoji: '⚠️' };
};

/**
 * Simulate AI hygiene analysis from image
 * In production, replace with actual Python FastAPI microservice call
 */
const simulateAIAnalysis = (imageName = '') => {
  // Simulate varying results based on time for demo
  const seed = Date.now() % 100;
  const score = 45 + seed;

  const allIssues = [
    { id: 'dirty_floor', label: 'Dirty Floor Detected', severity: 'high' },
    { id: 'open_food', label: 'Open Food Exposure', severity: 'high' },
    { id: 'no_gloves', label: 'Staff Without Gloves', severity: 'medium' },
    { id: 'garbage_overflow', label: 'Garbage Overflow', severity: 'high' },
    { id: 'unclean_utensils', label: 'Unclean Utensils', severity: 'medium' },
    { id: 'no_hairnet', label: 'No Hairnet Worn', severity: 'low' },
    { id: 'pest_presence', label: 'Possible Pest Signs', severity: 'critical' },
  ];

  const issueCount = score < 60 ? 4 : score < 80 ? 2 : 1;
  const shuffled = allIssues.sort(() => 0.5 - Math.random());
  const detectedIssues = shuffled.slice(0, issueCount);

  const suggestions = [
    'Clean chopping boards every 2 hours',
    'Ensure all staff wear gloves and hairnets',
    'Separate raw and cooked food storage areas',
    'Install proper waste bins with lids',
    'Schedule daily floor sanitization',
    'Check refrigerator temperatures hourly',
    'Replace damaged food containers immediately',
    'Improve handwash station visibility',
  ].slice(0, issueCount + 1);

  return {
    hygieneScore: Math.min(score, 100),
    detectedIssues,
    suggestions,
    analyzedAt: new Date().toISOString(),
  };
};

/**
 * Simulate food freshness analysis
 */
const simulateFreshnessAnalysis = () => {
  const statuses = ['Fresh', 'Medium', 'Spoiled', 'Unsafe'];
  const weights = [50, 30, 15, 5]; // probability weights
  const rand = Math.random() * 100;
  let cumulative = 0;
  let status = 'Fresh';

  for (let i = 0; i < statuses.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      status = statuses[i];
      break;
    }
  }

  const details = {
    Fresh: { confidence: 92, message: 'Food appears fresh and safe to consume', color: '#22C55E' },
    Medium: { confidence: 75, message: 'Food is acceptable but consume soon', color: '#F59E0B' },
    Spoiled: { confidence: 88, message: 'Food shows signs of spoilage - do not serve', color: '#EF4444' },
    Unsafe: { confidence: 95, message: 'Food is unsafe - discard immediately', color: '#7C3AED' },
  };

  return { status, ...details[status] };
};

module.exports = { calculateHygieneScore, getBadge, simulateAIAnalysis, simulateFreshnessAnalysis };
