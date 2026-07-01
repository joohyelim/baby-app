/**
 * FOOD 카테고리 상수 (안심 기준 정리.md §5 FOOD)
 *
 * 데모 타깃: 6개월 영아 (이유 초중기) · FOOD 카테고리
 */

import type { RiskLevel } from './types';

/** FOOD ✓ 안심특징 사전 라벨 */
export const FOOD_SAFE_LABELS = [
  '무합성보존료',
  '무인공색소',
  '무합성향료',
  '무MSG',
  '무합성감미료',
  '무발색제',
  '트랜스지방0',
  'Non-GMO',
  '유기농',
  '품질인증',
  'HACCP',
] as const;

/** FOOD 핵심 인증(가점 +10 대상) */
export const FOOD_CERTIFICATIONS = ['유기농', '품질인증', 'HACCP'] as const;

/**
 * FOOD ✕ 걱정요소 사전 — 라벨과 위험 수준 매핑.
 * 위험 수준은 안심점수 감점(고 -25 / 중 -15 / 경 -7)에 사용됩니다.
 */
export const FOOD_CONCERN_RISKS: Record<string, RiskLevel> = {
  '합성보존료(소르빈산)': 'high',
  '합성보존료(안식향산)': 'high',
  '인공색소(타르)': 'high',
  '발색제(아질산나트륨)': 'high',
  '카페인': 'high',
  '경화유/트랜스지방': 'high',
  '카라멜색소': 'medium',
  '합성향료': 'medium',
  '향미증진제(MSG)': 'medium',
  '합성감미료': 'medium',
  '당류 과다': 'medium',
  '나트륨 과다': 'medium',
  'GMO 우려': 'low',
};

/**
 * 0~2세 FOOD 기준선 (안심 기준 정리.md §5)
 * - 1회 나트륨 50mg 이하
 * - 1회 당류 3g 이하
 * - 원재료 3~5개
 */
export const FOOD_BASELINE = {
  maxSodiumMg: 50,
  maxSugarG: 3,
  minIngredientCount: 3,
  maxIngredientCount: 5,
} as const;

/** 안심점수 가중치 (안심 기준 정리.md §2 초기안) */
export const SCORE_WEIGHTS = {
  // 감점 (걱정요소)
  penalty: {
    high: -25,
    medium: -15,
    low: -7,
  },
  // 가점 (안심특징)
  bonus: {
    certification: 10, // 핵심 인증
    general: 3, // 일반 안심 표시
  },
  base: 100,
} as const;

/** 등급 임계값 (안심 기준 정리.md §2) */
export const GRADE_THRESHOLDS = {
  safe: 90, // 🟢 안심
  good: 70, // 🟡 양호
  caution: 50, // 🟠 주의
  // 50점 미만 🔴 경고
} as const;
