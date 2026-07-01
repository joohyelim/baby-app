/**
 * 도메인 타입 정의 (Domain types)
 *
 * 안심 기준 정리.md의 평가 모델 중, FOOD 카테고리 데모에 필요한 부분만 정의합니다.
 *
 * 참고: 평가 모델은 본래 두 갈래(① 성분 안심점수 / ② 신뢰 지표)지만,
 * FOOD 카테고리에서는 ② 신뢰 지표를 사용하지 않습니다. 인증(HACCP·유기농·품질인증)은
 * FOOD ✓ 안심특징 목록에 포함되어 성분 안심점수의 가점으로 처리합니다.
 * (신뢰 지표는 향후 WARE·TOY·LIFE 등 다른 카테고리 확장 시 도입)
 */

/** 카테고리 코드 — 데모는 FOOD만 다룹니다. (안심 기준 정리.md §3) */
export type CategoryCode = 'FOOD' | 'WARE' | 'TOY' | 'LIFE';

/** 월령 발달 단계 — 데모는 6개월(이유 초중기) 스코프. (월령별_발달단계_리서치.md §7) */
export type DevelopmentStageId =
  | 'feeding' // ① 수유기 0~5m
  | 'weaning-early' // ② 이유 초중기 6~9m  ← 데모 타깃
  | 'weaning-late' // ③ 이유 후기 9~12m
  | 'toddler'; // ④ 완료기·유아 12~24m

/** 안심점수 등급 (안심 기준 정리.md §2) */
export type SafetyGrade = 'safe' | 'good' | 'caution' | 'warning';

/** 위험 수준 — 걱정요소 감점 가중치와 연결됩니다. */
export type RiskLevel = 'high' | 'medium' | 'low';

/**
 * ✓ 안심특징 / ✕ 걱정요소 단일 항목 (성분 안심점수 입력)
 */
export interface IngredientFlag {
  /** 표시 라벨 (예: "무합성보존료", "유기농", "합성색소(타르)") */
  label: string;
  /** 'safe' = ✓ 안심특징, 'concern' = ✕ 걱정요소 */
  kind: 'safe' | 'concern';
  /** 걱정요소(concern)일 때 감점 산정에 쓰이는 위험 수준 */
  risk?: RiskLevel;
  /**
   * 안심특징(safe)이 핵심 인증인지 여부.
   * true → 가점 +10 (HACCP·유기농·품질인증 등), false/생략 → 일반 안심 표시 +3
   */
  certification?: boolean;
}

/** 영양 정보 — FOOD 전용 (0~2세 기준선 대조용) */
export interface NutritionFacts {
  /** 1회 제공량 기준 나트륨(mg) — 기준선 50mg */
  sodiumMg?: number;
  /** 1회 제공량 기준 당류(g) — 기준선 3g */
  sugarG?: number;
  /** 원재료 개수 — 권장 3~5개 */
  ingredientCount?: number;
}

/** 제품 카드 한 장을 구성하는 데이터 (FOOD 데모) */
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryCode;
  /** FOOD 하위 품목 (예: '분유', '이유식', '유아간식') */
  subCategory: string;
  /** 추천 월령 단계 */
  stage: DevelopmentStageId;
  imageUrl?: string;
  /** ① 성분 안심: ✓/✕ 플래그 목록 */
  ingredientFlags: IngredientFlag[];
  /** FOOD 영양 정보 */
  nutrition?: NutritionFacts;
  /** 전성분 표기 여부 — 미표기 시 "✓ 무첨가"를 부여하지 않음 (안심 기준 정리.md §2) */
  hasFullIngredientList: boolean;
  /** 구매처 제휴 링크 */
  affiliateUrl?: string;
}

/** 계산된 안심점수 결과 */
export interface SafetyScore {
  score: number; // 0~100
  grade: SafetyGrade;
}
