// IOM/WHO Pregnancy Weight Gain Guidelines
// Based on Institute of Medicine (IOM) 2009 Recommendations

export const BMI_CATEGORIES = {
  UNDERWEIGHT: { label: 'Thiếu cân', min: 0, max: 18.5 },
  NORMAL: { label: 'Bình thường', min: 18.5, max: 24.9 },
  OVERWEIGHT: { label: 'Thừa cân', min: 25, max: 29.9 },
  OBESE: { label: 'Béo phì', min: 30, max: 100 },
};

// Total recommended weight gain (kg) by BMI category
export const WEIGHT_GAIN_RECS = {
  UNDERWEIGHT: { min: 12.5, max: 18, weeklyT23: 0.51 },
  NORMAL:      { min: 11.5, max: 16, weeklyT23: 0.42 },
  OVERWEIGHT:  { min: 7,    max: 11.5, weeklyT23: 0.28 },
  OBESE:       { min: 5,    max: 9,    weeklyT23: 0.22 },
};

// First trimester gain (weeks 1-13): 0.5–2 kg total
const T1_GAIN = { min: 0.5, max: 2 };

export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export function getBMICategory(bmi) {
  if (!bmi) return 'NORMAL';
  if (bmi < 18.5) return 'UNDERWEIGHT';
  if (bmi < 25) return 'NORMAL';
  if (bmi < 30) return 'OVERWEIGHT';
  return 'OBESE';
}

export function getBMICategoryLabel(bmi) {
  const cat = getBMICategory(bmi);
  return BMI_CATEGORIES[cat]?.label || 'Bình thường';
}

// Get recommended total gain range for a BMI value
export function getRecommendedGain(bmi) {
  const cat = getBMICategory(bmi);
  return WEIGHT_GAIN_RECS[cat] || WEIGHT_GAIN_RECS.NORMAL;
}

// Get recommended weight at a specific week
export function getRecommendedWeightAtWeek(preWeight, bmi, week) {
  const rec = getRecommendedGain(bmi);
  if (week <= 13) {
    // T1: linear from 0 to T1_GAIN over 13 weeks
    const minW = preWeight + (T1_GAIN.min / 13) * week;
    const maxW = preWeight + (T1_GAIN.max / 13) * week;
    return { min: Math.round(minW * 10) / 10, max: Math.round(maxW * 10) / 10 };
  }
  // T2-T3: T1 gain + weekly gain * (week - 13)
  const weeksAfterT1 = week - 13;
  const t1MinGain = T1_GAIN.min;
  const t1MaxGain = T1_GAIN.max;
  const minW = preWeight + t1MinGain + rec.weeklyT23 * 0.7 * weeksAfterT1;
  const maxW = preWeight + t1MaxGain + rec.weeklyT23 * 1.3 * weeksAfterT1;
  return { min: Math.round(minW * 10) / 10, max: Math.round(maxW * 10) / 10 };
}

// Evaluate current weight status
export function evaluateWeight(preWeight, currentWeight, week, heightCm) {
  if (!preWeight || !currentWeight || !heightCm) return null;
  const bmi = calcBMI(preWeight, heightCm);
  const rec = getRecommendedGain(bmi);
  const totalGain = currentWeight - preWeight;
  const recAtWeek = getRecommendedWeightAtWeek(preWeight, bmi, week);
  
  let status = 'normal'; // ok
  let label = '✅ Bình thường';
  let color = '#4CAF50';
  
  if (currentWeight < recAtWeek.min) {
    status = 'under';
    label = '⚠️ Tăng ít hơn khuyến nghị';
    color = '#FF9800';
  } else if (currentWeight > recAtWeek.max) {
    status = 'over';
    label = '⚠️ Tăng nhiều hơn khuyến nghị';
    color = '#F44336';
  }
  
  return {
    status,
    label,
    color,
    totalGain: Math.round(totalGain * 10) / 10,
    recMin: rec.min,
    recMax: rec.max,
    recAtWeek,
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: getBMICategoryLabel(bmi),
  };
}
