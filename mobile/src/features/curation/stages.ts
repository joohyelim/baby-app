/**
 * 월령 발달 단계 정의 (월령별_발달단계_리서치.md §7)
 *
 * 데모는 'weaning-early'(6개월·이유 초중기)만 활성화합니다.
 */

import type { DevelopmentStageId } from '@/domain/types';

export interface DevelopmentStage {
  id: DevelopmentStageId;
  label: string;
  monthRange: string;
  /** 먹는 방식 */
  feeding: string;
  /** 이 단계에 새로 등장하는 FOOD 하위 품목 */
  foodFocus: string[];
  /** 데모에서 활성화된 단계인지 */
  active: boolean;
}

export const DEVELOPMENT_STAGES: DevelopmentStage[] = [
  {
    id: 'feeding',
    label: '수유기',
    monthRange: '0~5개월',
    feeding: '모유/분유 전적',
    foodFocus: ['분유'],
    active: false,
  },
  {
    id: 'weaning-early',
    label: '이유 초중기',
    monthRange: '6~9개월',
    feeding: '모유/분유 + 이유식 시작',
    foodFocus: ['이유식', '분유', '유아간식'],
    active: true, // ← 데모 타깃
  },
  {
    id: 'weaning-late',
    label: '이유 후기',
    monthRange: '9~12개월',
    feeding: '고형식↑ 수유↓',
    foodFocus: ['이유식', '유아간식'],
    active: false,
  },
  {
    id: 'toddler',
    label: '완료기·유아',
    monthRange: '12~24개월',
    feeding: '성인식 형태',
    foodFocus: ['유아식', '유아간식'],
    active: false,
  },
];

/** 데모 기본 단계: 6개월 (이유 초중기) */
export const DEMO_STAGE_ID: DevelopmentStageId = 'weaning-early';

export function getStage(id: DevelopmentStageId): DevelopmentStage | undefined {
  return DEVELOPMENT_STAGES.find((s) => s.id === id);
}
