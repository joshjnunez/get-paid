// Commission calculation utility functions
// Based on comp plan: base $72k, OTE $102k, variable $30k/yr, $2500/mo target, 35pt quota
// New logic: points 0-35 are $71.43 each, points 35+ are $100 flat per point

const BASE_POINT_VALUE = 2500 / 35; // ~71.4285714286
const OVER_QUOTA_POINT_VALUE = 100; // $100 flat per point over quota
const MONTHLY_BASE_GROSS = 6000;
const MONTHLY_VARIABLE_TARGET = 2500;
const MONTHLY_QUOTA_POINTS = 35;

export const CONSTANTS = {
  BASE_POINT_VALUE,
  OVER_QUOTA_POINT_VALUE,
  MONTHLY_BASE_GROSS,
  MONTHLY_VARIABLE_TARGET,
  MONTHLY_QUOTA_POINTS,
} as const;

export interface TierBreakdown {
  baseCommission: number;
  overQuotaPoints: number;
  overQuotaValue: number;
  totalCommission: number;
}

export interface TierStatus {
  tier: 'below' | 'quota' | 'over';
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

export function calculateTierBreakdown(points: number): TierBreakdown {
  if (points <= 0) {
    return {
      baseCommission: 0,
      overQuotaPoints: 0,
      overQuotaValue: 0,
      totalCommission: 0,
    };
  }

  if (points <= MONTHLY_QUOTA_POINTS) {
    const commission = points * BASE_POINT_VALUE;
    return {
      baseCommission: commission,
      overQuotaPoints: 0,
      overQuotaValue: 0,
      totalCommission: commission,
    };
  }

  const baseCommission = MONTHLY_VARIABLE_TARGET;
  const overQuotaPoints = points - MONTHLY_QUOTA_POINTS;
  const overQuotaValue = overQuotaPoints * OVER_QUOTA_POINT_VALUE;

  return {
    baseCommission,
    overQuotaPoints,
    overQuotaValue,
    totalCommission: baseCommission + overQuotaValue,
  };
}

export function calculateCommission(points: number): number {
  return calculateTierBreakdown(points).totalCommission;
}

export function calculateGrossPay(points: number): number {
  return MONTHLY_BASE_GROSS + calculateCommission(points);
}

export function calculateAttainmentPercent(points: number): number {
  return (points / MONTHLY_QUOTA_POINTS) * 100;
}

export function calculatePointsRemaining(points: number): number {
  return Math.max(MONTHLY_QUOTA_POINTS - points, 0);
}

export function getCurrentTierStatus(points: number): TierStatus {
  const attainmentPercent = calculateAttainmentPercent(points);

  if (points > MONTHLY_QUOTA_POINTS) {
    return {
      tier: 'over',
      label: 'Over Quota',
      attainmentPercent,
      pointsToNextTier: 0,
      nextTierLabel: '',
    };
  }

  if (points === MONTHLY_QUOTA_POINTS) {
    return {
      tier: 'quota',
      label: 'At Quota',
      attainmentPercent,
      pointsToNextTier: 0,
      nextTierLabel: 'Over Quota',
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
  addedPoints: number
): ScenarioProjection {
  const projectedPoints = currentPoints + addedPoints;
  const currentCommission = calculateCommission(currentPoints);
  const projectedCommission = calculateCommission(projectedPoints);
  const currentGross = calculateGrossPay(currentPoints);
  const projectedGross = calculateGrossPay(projectedPoints);

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
