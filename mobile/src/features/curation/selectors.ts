/**
 * 큐레이션 셀렉터 — 월령 단계로 제품을 골라줍니다.
 * "꼭 필요한 것만 골라준다"는 컨셉(안심 기준 정리.md §1)에 따라
 * 단계별 FOOD 제품만 필터링합니다.
 */

import type { DevelopmentStageId, Product } from '@/domain/types';
import { FOOD_PRODUCTS } from '@/data/mock/products.food';

/** 특정 월령 단계의 FOOD 제품 목록 */
export function getFoodProductsForStage(stage: DevelopmentStageId): Product[] {
  return FOOD_PRODUCTS.filter((p) => p.stage === stage);
}

/** id로 단일 제품 조회 */
export function getProductById(id: string): Product | undefined {
  return FOOD_PRODUCTS.find((p) => p.id === id);
}
