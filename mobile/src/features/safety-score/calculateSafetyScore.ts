/**
 * 안심점수 계산 로직 (FOOD)
 *
 * 안심 기준 정리.md §2 "안심점수 계산 방법(초기안)"을 구현합니다.
 *   - 기준점 100에서 시작
 *   - 걱정요소 감점: 고위험 -25 / 중위험 -15 / 경위험 -7
 *   - 안심특징 가점: 핵심 인증 +10 / 일반 안심 표시 +3
 *   - 0~100 범위로 클램프
 *   - 안전장치: 전성분 미표기 시 ✓ 안심특징(가점)을 부여하지 않음
 */

import type { IngredientFlag, Product, SafetyGrade, SafetyScore } from '@/domain/types';
import { GRADE_THRESHOLDS, SCORE_WEIGHTS } from '@/domain/constants';

/** 점수 → 등급 변환 */
export function toGrade(score: number): SafetyGrade {
  if (score >= GRADE_THRESHOLDS.safe) return 'safe';
  if (score >= GRADE_THRESHOLDS.good) return 'good';
  if (score >= GRADE_THRESHOLDS.caution) return 'caution';
  return 'warning';
}

/**
 * 제품 하나의 안심점수를 계산합니다.
 *
 * @param product 평가 대상 제품
 */
export function calculateSafetyScore(product: Product): SafetyScore {
  const { ingredientFlags, hasFullIngredientList } = product;

  let score = SCORE_WEIGHTS.base;

  for (const flag of ingredientFlags) {
    score += scoreForFlag(flag, hasFullIngredientList);
  }

  // 0~100 범위로 제한
  score = Math.max(0, Math.min(100, score));

  return { score, grade: toGrade(score) };
}

/** 단일 플래그의 점수 기여분 */
function scoreForFlag(flag: IngredientFlag, hasFullIngredientList: boolean): number {
  if (flag.kind === 'concern') {
    if (!flag.risk) return 0;
    return SCORE_WEIGHTS.penalty[flag.risk];
  }

  // 안심특징(safe): 전성분이 표기되지 않으면 가점을 주지 않음(정보 없음 != 안심)
  if (!hasFullIngredientList) return 0;

  return flag.certification ? SCORE_WEIGHTS.bonus.certification : SCORE_WEIGHTS.bonus.general;
}
