/**
 * 데모용 FOOD 목 데이터 — 6개월(이유 초중기) 영아 대상
 *
 * 안심 기준 정리.md §5(FOOD 안심특징/걱정요소), §7(발달 단계별 가이드)에 근거한 예시.
 * ⚠️ 실제 제품/브랜드가 아닌 데모용 가상 데이터입니다.
 */

import type { Product } from '@/domain/types';

export const FOOD_PRODUCTS: Product[] = [
  {
    id: 'food-001',
    name: '오가닉 첫 쌀미음 이유식',
    brand: '데모키친',
    category: 'FOOD',
    subCategory: '이유식',
    stage: 'weaning-early',
    hasFullIngredientList: true,
    ingredientFlags: [
      { label: '유기농', kind: 'safe', certification: true },
      { label: 'HACCP', kind: 'safe', certification: true },
      { label: '무합성보존료', kind: 'safe' },
      { label: '무인공색소', kind: 'safe' },
      { label: '무MSG', kind: 'safe' },
    ],
    nutrition: { sodiumMg: 12, sugarG: 0.5, ingredientCount: 3 },
    affiliateUrl: 'https://example.com/buy/food-001',
  },
  {
    id: 'food-002',
    name: '소고기 채소 큐브 이유식',
    brand: '데모키친',
    category: 'FOOD',
    subCategory: '이유식',
    stage: 'weaning-early',
    hasFullIngredientList: true,
    ingredientFlags: [
      { label: 'HACCP', kind: 'safe', certification: true },
      { label: '무합성보존료', kind: 'safe' },
      { label: 'Non-GMO', kind: 'safe' },
      { label: '나트륨 과다', kind: 'concern', risk: 'medium' },
    ],
    nutrition: { sodiumMg: 68, sugarG: 1.2, ingredientCount: 5 },
    affiliateUrl: 'https://example.com/buy/food-002',
  },
  {
    id: 'food-003',
    name: '쌀과자 유아간식 스틱',
    brand: '데모스낵',
    category: 'FOOD',
    subCategory: '유아간식',
    stage: 'weaning-early',
    hasFullIngredientList: true,
    ingredientFlags: [
      { label: '무인공색소', kind: 'safe' },
      { label: '당류 과다', kind: 'concern', risk: 'medium' },
      { label: '합성향료', kind: 'concern', risk: 'medium' },
    ],
    nutrition: { sodiumMg: 40, sugarG: 4.5, ingredientCount: 8 },
    affiliateUrl: 'https://example.com/buy/food-003',
  },
  {
    id: 'food-004',
    name: '달콤 과일맛 유아 음료',
    brand: '데모드링크',
    category: 'FOOD',
    subCategory: '유아간식',
    stage: 'weaning-early',
    hasFullIngredientList: true,
    ingredientFlags: [
      { label: '인공색소(타르)', kind: 'concern', risk: 'high' },
      { label: '합성보존료(안식향산)', kind: 'concern', risk: 'high' },
      { label: '합성감미료', kind: 'concern', risk: 'medium' },
      { label: '당류 과다', kind: 'concern', risk: 'medium' },
    ],
    nutrition: { sodiumMg: 30, sugarG: 9, ingredientCount: 11 },
    affiliateUrl: 'https://example.com/buy/food-004',
  },
  {
    id: 'food-005',
    name: '단계별 분유 2단계',
    brand: '데모밀크',
    category: 'FOOD',
    subCategory: '분유',
    stage: 'weaning-early',
    // 전성분 미표기 예시 — ✓ 안심특징 가점이 적용되지 않아야 함
    hasFullIngredientList: false,
    ingredientFlags: [
      { label: '무합성향료', kind: 'safe' },
      { label: '무합성감미료', kind: 'safe' },
    ],
    nutrition: { ingredientCount: undefined },
    affiliateUrl: 'https://example.com/buy/food-005',
  },
];
