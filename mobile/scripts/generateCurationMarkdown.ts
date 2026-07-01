/**
 * TS → MD 자동 생성 스크립트
 *
 * 단일 소스: src/features/curation/curationContent.ts
 * 출력:      ../리서치/월령별_마중물_큐레이션_컨텐츠.md
 *
 * 실행: cd mobile && npm run gen:curation-md
 */

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CURATION_CONTENT,
  COMMON_ITEMS,
  ITEM_DOMAIN_LABELS,
  SUPPLEMENT_GUIDELINE,
  type CareDomain,
  type EssentialItem,
  type ItemPriority,
  type StageCurationContent,
} from '../src/features/curation/curationContent';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../../리서치/월령별_마중물_큐레이션_컨텐츠.md');

const CARE_DOMAIN_EMOJI: Record<CareDomain, string> = {
  식이: '🍼',
  수면: '💤',
  '위생·자립': '🚽',
  '이동·신체': '👟',
};

const PRIORITY_EMOJI: Record<ItemPriority, string> = {
  core: '⭐',
  optional: '◽',
};

/** 마크다운 표 셀 안의 파이프 문자 escape */
function escapeCell(text: string): string {
  return text.replace(/\|/g, '\\|');
}

/** 요약 표용 대표 템빨 라벨 — 핵심 아이템 우선, 첫 세그먼트만 추출 */
function representativeItems(stage: StageCurationContent, count = 3): string {
  const sorted = [...stage.essentialItems].sort(
    (a, b) => priorityRank(a.priority) - priorityRank(b.priority),
  );
  return sorted
    .slice(0, count)
    .map((i) => i.item.split('(')[0].split('·')[0].trim())
    .join(', ');
}

function priorityRank(p: ItemPriority): number {
  return p === 'core' ? 0 : 1;
}

/** 요약 표용 핵심 전환점 — 핵심 트리거 우선 */
function keyTransitionLabel(stage: StageCurationContent): string {
  const key = stage.careTransitions.find((t) => t.isKeyTrigger) ?? stage.careTransitions[0];
  if (!key) return '–';
  return key.isKeyTrigger ? `★ ${key.title}` : key.title;
}

function renderHeader(): string {
  const today = new Date().toISOString().slice(0, 10);
  const domainList = Object.entries(ITEM_DOMAIN_LABELS)
    .map(([code, label]) => `${label}(${code})`)
    .join(' · ');

  return [
    '# 월령별 마중물 큐레이션 컨텐츠',
    '',
    '> ⚙️ **이 파일은 자동 생성됩니다. 직접 수정하지 마세요.**',
    '> 단일 소스: `mobile/src/features/curation/curationContent.ts`',
    '> 재생성: `cd mobile && npm run gen:curation-md`',
    '>',
    '> 목적: 아기가 **N개월**일 때 → **어떤 발달 단계**라서 → **어떤 핵심 아이템/카테고리("템빨")** 가 필요한지를 정리한 큐레이션 컨텐츠.',
    '> 근거: [월령별_발달단계_리서치.md](./월령별_발달단계_리서치.md) §3 권장 큐레이션 구간 7단계, L3 케어 루틴 전환점, §4 장난감 / §5 책 큐레이션',
    `> 생성일: ${today}`,
    '',
    '---',
    '',
    '## 표기 규칙',
    '',
    '- **필수도**: ⭐ 꼭 필요 (core) / ◽ 있으면 편함 (optional)',
    '- **🔔 트리거**: 월령보다 우선하는 행동 기반 노출 조건 (예: "이유식 시작했어요")',
    '- **★ 핵심 전환**: 가장 강력한 구매 트리거가 되는 케어 루틴 전환점',
    `- **도메인**: ${domainList}`,
  ].join('\n');
}

function renderSummaryTable(): string {
  const rows = CURATION_CONTENT.map((s) => {
    const demo = isDemoStage(s) ? ' **(데모)**' : '';
    return `| ${s.order} | ${s.label}${demo} | ${s.monthRange} | ${escapeCell(
      keyTransitionLabel(s),
    )} | ${escapeCell(representativeItems(s))} |`;
  });

  return [
    '## 한눈에 보기 (7단계)',
    '',
    '| # | 단계 | 월령 | 핵심 전환점 | 대표 템빨 |',
    '|---|---|---|---|---|',
    ...rows,
    '',
    '> 위 표의 단계별 템빨 외에, 모든 단계에 **[전 단계 공통 · 상시 소모품]**(기저귀·물티슈·보습·세탁세제)이 함께 적용됩니다.',
  ].join('\n');
}

/** 6개월이 포함되는 단계 = 데모 1차 구간 */
function isDemoStage(stage: StageCurationContent): boolean {
  return 6 >= stage.ageMonths.min && 6 <= stage.ageMonths.max;
}

function renderTransition(stage: StageCurationContent): string {
  if (stage.careTransitions.length === 0) return '';
  const lines = stage.careTransitions.map((t) => {
    const emoji = CARE_DOMAIN_EMOJI[t.domain];
    const star = t.isKeyTrigger ? ' ★' : '';
    return `- ${emoji} **${t.domain} — ${t.title}**${star} : ${t.description}`;
  });
  return ['**케어 루틴 전환점**', '', ...lines].join('\n');
}

function renderItemsTable(items: EssentialItem[]): string {
  const rows = items.map((i) => {
    const priority = PRIORITY_EMOJI[i.priority];
    const trigger = i.behaviorTrigger ? escapeCell(i.behaviorTrigger) : '';
    return `| ${ITEM_DOMAIN_LABELS[i.domain]} | ${escapeCell(i.item)} | ${priority} | ${escapeCell(
      i.reason,
    )} | ${trigger} |`;
  });
  return [
    '**핵심 아이템 (템빨)**',
    '',
    '| 도메인 | 아이템 | 필수도 | 왜 필요한가 | 🔔 트리거 |',
    '|---|---|---|---|---|',
    ...rows,
  ].join('\n');
}

function renderStage(stage: StageCurationContent): string {
  const demoSuffix = isDemoStage(stage) ? ' ← 6개월 데모 구간' : '';
  const blocks = [
    `## ${stage.order}단계 · ${stage.label} (${stage.monthRange})${demoSuffix}`,
    `**발달 요약:** ${stage.developmentSummary}`,
    `**발달 키워드:** ${stage.developmentKeywords.join(' · ')}`,
    renderTransition(stage),
    renderItemsTable(stage.essentialItems),
  ];
  return blocks.filter((b) => b !== '').join('\n\n');
}

function renderFooter(): string {
  return [
    '## 활용 메모',
    '',
    '- **±1단계 노출:** 발달 개인차를 반영해 현재 단계 ±1 구간 아이템도 함께 노출 권장.',
    '- **행동 트리거 우선:** "6개월이 됐어요"보다 "이유식 시작했어요"가 더 정확한 노출 조건.',
    '- **데모 1차 범위:** 2단계(뒤집기, 6개월) × 식품(FOOD)부터 시작.',
  ].join('\n');
}

function renderCommonSection(): string {
  return [
    '## 전 단계 공통 · 상시 소모품',
    '',
    '> 특정 발달 단계가 아니라 영유아 기간 내내 반복 구매하는 소모품. **모든 단계 큐레이션에 기본 포함**됩니다. (기저귀는 배변훈련 이후 점차 졸업)',
    '',
    renderItemsTable(COMMON_ITEMS),
  ].join('\n');
}

function renderSupplementGuideline(): string {
  const g = SUPPLEMENT_GUIDELINE;
  return [
    `## ${g.title}`,
    '',
    '> 영양제는 식품(FOOD)과 규제 트랙이 다른 **건강기능식품**입니다. 두 축으로 평가합니다.',
    '',
    '**① 영양 권고 (왜/언제/얼마)**',
    '',
    ...g.nutritionBasis.map((line) => `- ${line}`),
    '',
    '**② 제품 안심 (안전)**',
    '',
    ...g.safetyBasis.map((line) => `- ${line}`),
  ].join('\n');
}

function buildMarkdown(): string {
  const sections = [
    renderHeader(),
    renderSummaryTable(),
    renderCommonSection(),
    ...CURATION_CONTENT.map(renderStage),
    renderSupplementGuideline(),
    renderFooter(),
  ];
  return sections.join('\n\n---\n\n') + '\n';
}

function main(): void {
  const markdown = buildMarkdown();
  writeFileSync(OUTPUT_PATH, markdown, { encoding: 'utf8' });
  console.log(`\u2713 \uc0dd\uc131 \uc644\ub8cc: ${OUTPUT_PATH}`);
  console.log(`  ${CURATION_CONTENT.length}\uac1c \ub2e8\uacc4, ${markdown.length} chars`);
}

main();
