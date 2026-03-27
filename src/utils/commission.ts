// Commission calculation utility functions
// Based on comp plan: base $72k, OTE $102k, variable $30k/yr, $2500/mo target, 30pt quota

const BASE_POINT_VALUE = 2500 / 30; // ~83.3333333333
const MONTHLY_BASE_GROSS = 6000;
const MONTHLY_VARIABLE_TARGET = 2500;
const MONTHLY_QUOTA_POINTS = 30;
const TIER1_MULTIPLIER = 1.5;
const TIER2_MULTIPLIER = 2;
const TIER1_CEILING = 37.5;
const TIER2_CEILING = 45;

export const CONSTANTS = {
  BASE_POINT_VALUE,
  MONTHLY_BASE_GROSS,
  MONTHLY_VARIABLE_TARGET,
  MONTHLY_QUOTA_POINTS,
  TIER1_MULTIPLIER,
  TIER2_MULTIPLIER,
  TIER1_CEILING,
  TIER2_CEILING,
} as const;

export interface TierBreakdown {
  baseCommission: number;
  tier1Points: number;
  tier1Value: number;
  tier2Points: number;
  tier2Value: number;
  tier3Points: number;
  tier3Value: number;
  totalCommission: number;
}

export interface TierStatus {
  tier: 'below' | 'quota' | 'tier1' | 'tier2' | 'tier3';
  label: string;
  attainmentPercent: number;
  pointsToNextTier: number;
  nextTierLabel: string;
}

export interface ScenarioProjection {
  currentPoints: number;
  addedPoints: number;
  projectedPoints: number;
  currentCommission: number;
  projectedCommission: number;
  currentGross: number;
  projectedGross: number;
  increaseCommission: number;
  increaseGross: number;
}

export function calculateTierBreakdown(points: number, topTierMultiplier: number): TierBreakdown {
  if (points <= 0) {
    return {
      baseCommission: 0,
      tier1Points: 0,
      tier1Value: 0,
      tier2Points: 0,
      tier2Value: 0,
      tier3Points: 0,
      tier3Value: 0,
      totalCommission: 0,
    };
  }

  if (points <= MONTHLY_QUOTA_POINTS) {
    const commission = points * BASE_POINT_VALUE;
    return {
      baseCommission: commission,
      tier1Points: 0,
      tier1Value: 0,
      tier2Points: 0,
      tier2Value: 0,
      tier3Points: 0,
      tier3Value: 0,
      totalCommission: commission,
    };
  }

  const baseCommission = MONTHLY_VARIABLE_TARGET;
  const tier1PointValue = BASE_POINT_VALUE * TIER1_MULTIPLIER; // 125
  const tier2PointValue = BASE_POINT_VALUE * TIER2_MULTIPLIER; // 166.6666666667
  const tier3PointValue = BASE_POINT_VALUE * topTierMultiplier;

  const tier1Points = Math.min(Math.max(points - MONTHLY_QUOTA_POINTS, 0), TIER1_CEILING - MONTHLY_QUOTA_POINTS);
  const tier2Points = Math.min(Math.max(points - TIER1_CEILING, 0), TIER2_CEILING - TIER1_CEILING);
  const tier3Points = Math.max(points - TIER2_CEILING, 0);

  const tier1Value = tier1Points * tier1PointValue;
  const tier2Value = tier2Points * tier2PointValue;
  const tier3Value = tier3Points * tier3PointValue;

  return {
    baseCommission,
    tier1Points,
    tier1Value,
    tier2Points,
    tier2Value,
    tier3Points,
    tier3Value,
    totalCommission: baseCommission + tier1Value + tier2Value + tier3Value,
  };
}

export function calculateCommission(points: number, topTierMultiplier: number): number {
  return calculateTierBreakdown(points, topTierMultiplier).totalCommission;
}

export function calculateGrossPay(points: number, topTierMultiplier: number): number {
  return MONTHLY_BASE_GROSS + calculateCommission(points, topTierMultiplier);
}

export function calculateAttainmentPercent(points: number): number {
  return (points / MONTHLY_QUOTA_POINTS) * 100;
}

export function calculatePointsRemaining(points: number): number {
  return Math.max(MONTHLY_QUOTA_POINTS - points, 0);
}

export function getCurrentTierStatus(points: number): TierStatus {
  const attainmentPercent = calculateAttainmentPercent(points);

  if (points >= TIER2_CEILING) {
    return {
      tier: 'tier3',
      label: 'Tier 3 Accelerator',
      attainmentPercent,
      pointsToNextTier: 0,
      nextTierLabel: 'Max tier reached',
    };
  }

  if (points >= TIER1_CEILING) {
    return {
      tier: 'tier2',
      label: 'Tier 2 Accelerator',
      attainmentPercent,
      pointsToNextTier: TIER2_CEILING - points,
      nextTierLabel: 'Tier 3',
    };
  }

  if (points > MONTHLY_QUOTA_POINTS) {
    return {
      tier: 'tier1',
      label: 'Tier 1 Accelerator',
      attainmentPercent,
      pointsToNextTier: TIER1_CEILING - points,
      nextTierLabel: 'Tier 2',
    };
  }

  if (points === MONTHLY_QUOTA_POINTS) {
    return {
      tier: 'quota',
      label: 'At Quota',
      attainmentPercent,
      pointsToNextTier: 0,
      nextTierLabel: 'Tier 1',
    };
  }

  return {
    tier: 'below',
    label: 'Below Quota',
    attainmentPercent,
    pointsToNextTier: MONTHLY_QUOTA_POINTS - points,
    nextTierLabel: 'Quota',
  };
}

export function calculateScenarioProjection(
  currentPoints: number,
  addedPoints: number,
  topTierMultiplier: number
): ScenarioProjection {
  const projectedPoints = currentPoints + addedPoints;
  const currentCommission = calculateCommission(currentPoints, topTierMultiplier);
  const projectedCommission = calculateCommission(projectedPoints, topTierMultiplier);
  const currentGross = calculateGrossPay(currentPoints, topTierMultiplier);
  const projectedGross = calculateGrossPay(projectedPoints, topTierMultiplier);

  return {
    currentPoints,
    addedPoints,
    projectedPoints,
    currentCommission,
    projectedCommission,
    currentGross,
    projectedGross,
    increaseCommission: projectedCommission - currentCommission,
    increaseGross: projectedGross - currentGross,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
