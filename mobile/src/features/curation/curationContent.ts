/**
 * 월령별 마중물 큐레이션 컨텐츠 (Master curation content)
 *
 * 목적: "아기가 N개월일 때 → 어떤 발달 단계라서 → 어떤 핵심 아이템/카테고리가
 *       꼭 필요한 '템빨'인지"를 데이터화하여, 큐레이션 엔진의 컨텐츠 소스로 사용.
 *
 * 근거: 리서치/월령별_발달단계_리서치.md
 *   - §3 권장 큐레이션 구간 7단계 (L1 의료 + L2 발달행동 + L3 케어루틴 통합)
 *   - L3 케어 루틴 전환점 (식이·수면·위생·이동) = 가장 강력한 구매 트리거
 *   - §4 발달 장난감 / §5 책 큐레이션
 *
 * 참고: 이 7단계(0~60개월) 운동발달 기반 마스터 분류는,
 *       FOOD 데모의 4단계 수유 분류(stages.ts)와는 별개의 축입니다.
 */

/** 7단계 큐레이션 구간 ID (월령별_발달단계_리서치.md §3) */
export type CurationStageId =
  | 'newborn' // 0단계: 신생아 (0~1개월)
  | 'first-smile' // 1단계: 첫 웃음 (2~4개월)
  | 'rollover' // 2단계: 뒤집기 (5~8개월)  ← 6개월 데모 구간
  | 'crawling' // 3단계: 기기 (9~12개월)
  | 'first-steps' // 4단계: 첫 걸음 (13~18개월)
  | 'running' // 5단계: 뛰기 (19~36개월)
  | 'pretend-play'; // 6단계: 상상놀이 (37~60개월)

/** 아이템 도메인 — 킥오프 카테고리 + 안심 기준 카테고리를 실용적으로 통합 */
export type ItemDomain =
  | 'FOOD' // 식품 (분유·이유식·간식)
  | 'WARE' // 식기·수유용품 (젖병·식판·수저·컵)
  | 'TOY' // 교구·완구·책
  | 'LIFE' // 위생·생활 (기저귀·물티슈·세정·스킨케어)
  | 'WEAR' // 의류·침구
  | 'GEAR' // 이동·외출 (유모차·신발·카시트·자전거)
  | 'SAFETY' // 안전 (게이트·매트·가드)
  | 'SLEEP' // 수면 (수면자루·백색소음기·침대)
  | 'SUPPLEMENT'; // 영양제·건강기능식품 (비타민D·철분·유산균)

/** 도메인 표시 라벨 */
export const ITEM_DOMAIN_LABELS: Record<ItemDomain, string> = {
  FOOD: '식품',
  WARE: '식기·수유',
  TOY: '교구·완구·책',
  LIFE: '위생·생활',
  WEAR: '의류·침구',
  GEAR: '이동·외출',
  SAFETY: '안전',
  SLEEP: '수면',
  SUPPLEMENT: '영양제·건강기능식품',
};

/** 필수도: ⭐꼭 필요 / ◽있으면 편함 (안심 기준 정리.md §8) */
export type ItemPriority = 'core' | 'optional';

/** L3 케어 루틴 전환 도메인 */
export type CareDomain = '식이' | '수면' | '위생·자립' | '이동·신체';

/** 이 시기에 일어나는 케어 루틴 전환점 (구매 트리거의 '왜') */
export interface CareTransition {
  domain: CareDomain;
  /** 전환 이름 (예: "이유식 시작 (초기)") */
  title: string;
  /** 전환 내용 설명 */
  description: string;
  /** 핵심 구매 트리거 여부 (월령별_발달단계_리서치.md §3) */
  isKeyTrigger?: boolean;
}

/** 이 시기에 필요한 핵심 아이템 (= '템빨') */
export interface EssentialItem {
  domain: ItemDomain;
  /** 아이템/제품군 이름 (예: "초기 이유식 식기 세트") */
  item: string;
  /** 왜 이 시기에 필요한가 — 발달 단계와의 연결 (큐레이션 카피의 근거) */
  reason: string;
  priority: ItemPriority;
  /** L3 행동 트리거 — 월령보다 우선하는 노출 조건 (예: "이유식 시작했어요") */
  behaviorTrigger?: string;
}

/** 한 월령 단계의 마중물 큐레이션 컨텐츠 */
export interface StageCurationContent {
  id: CurationStageId;
  /** 구간 순서 0~6 */
  order: number;
  /** 구간 이름 (예: "뒤집기") */
  label: string;
  /** 월령 범위 표시 (예: "5~8개월") */
  monthRange: string;
  /** 월령 범위(개월) — 월령으로 단계를 찾을 때 사용 */
  ageMonths: { min: number; max: number };
  /** 이 시기 발달 요약 (한 줄 설명) */
  developmentSummary: string;
  /** L2 발달 키워드 */
  developmentKeywords: string[];
  /** L3 케어 루틴 전환점 */
  careTransitions: CareTransition[];
  /** 핵심 아이템(템빨) 목록 */
  essentialItems: EssentialItem[];
}

/**
 * 전 단계 공통 · 상시 소모품 (always-on consumables)
 *
 * 특정 발달 단계가 아니라 영유아 기간 내내 반복 구매하는 소모품.
 * 모든 단계 큐레이션에 기본 포함됩니다. (getAllItemsForStage 참고)
 * 참고: 기저귀는 배변훈련(5단계) 이후 점차 졸업합니다.
 */
export const COMMON_ITEMS: EssentialItem[] = [
  { domain: 'LIFE', item: '기저귀', reason: '매일 최다 사용하는 상시 소모품, 피부 직접 접촉. (배변훈련 후 점차 졸업)', priority: 'core' },
  { domain: 'LIFE', item: '물티슈', reason: '기저귀 교체·세정에 상시 사용. 전성분 확인 필요(인체청결용=화장품).', priority: 'core' },
  { domain: 'LIFE', item: '보습 로션·스킨케어', reason: '영유아 피부 장벽 보호를 위해 연중 상시 보습.', priority: 'core' },
  { domain: 'LIFE', item: '아기 전용 세탁세제', reason: '옷·침구 세탁에 상시 사용. 잔류·향료 저자극 필요.', priority: 'optional' },
];

/**
 * 영양제(건강기능식품) 큐레이션 기준
 *
 * 영양제는 식품(FOOD)과 규제 트랙이 다른 건강기능식품입니다.
 * 두 축으로 평가합니다: ① 영양 권고(왜/언제/얼마) ② 제품 안심(안전).
 */
export const SUPPLEMENT_GUIDELINE = {
  title: '영양제(건강기능식품) 큐레이션 기준',
  /** ① 영양 권고 근거 — 어떤 영양제를 언제 추천할지 */
  nutritionBasis: [
    '근거: 대한소아청소년과학회 2021 소아청소년 영양 가이드라인 + AAP(미국소아과학회) 정책성명',
    '비타민D: 400 IU/일 — 모유·혼합수유아 출생 직후~12개월 (분유 1L/일 이상이면 불필요)',
    '철분: 1 mg/kg/일 — 모유수유아 4~6개월부터 철분강화 이유식 전까지 (분유수유아 불필요)',
    '유산균(프로바이오틱스): 건강한 만삭아 일상 보충 권장 안 함(AAP 2024) → 선택·개별 상담',
  ],
  /** ② 제품 안심(안전) 기준 — 그 제품이 안전한지 */
  safetyBasis: [
    '관할: 식약처 「건강기능식품에 관한 법률」 (식품위생법 FOOD와 별도 트랙)',
    '확인: 건강기능식품 인증마크, 고시형/개별인정형 기능성 원료, 영유아 섭취 적합 여부',
    '표시: 일일섭취량·섭취 시 주의사항·이상사례 표시 준수',
  ],
} as const;

/**
 * 마스터 큐레이션 컨텐츠 — 7단계 (0~60개월)
 */
export const CURATION_CONTENT: StageCurationContent[] = [
  // ────────────────────────────────────────────────────────────
  {
    id: 'newborn',
    order: 0,
    label: '신생아',
    monthRange: '0~1개월',
    ageMonths: { min: 0, max: 1 },
    developmentSummary: '환경 적응·수면·애착 형성 시기. 영양은 모유/분유에 전적으로 의존.',
    developmentKeywords: ['적응', '수면', '애착', '체온 조절'],
    careTransitions: [
      {
        domain: '식이',
        title: '완전 수유기',
        description: '모유 또는 분유로만 영양 섭취. 하루 8~12회 수유.',
        isKeyTrigger: true,
      },
    ],
    essentialItems: [
      { domain: 'FOOD', item: '분유', reason: '모유 대체·보충 영양원. 이 시기 영양의 전부.', priority: 'core' },
      { domain: 'WARE', item: '젖병·젖병솔·젖병세정제', reason: '수유와 위생 세척 필수 도구.', priority: 'core' },
      { domain: 'WARE', item: '젖병소독기', reason: '면역 약한 신생아 위생 보조.', priority: 'optional' },
      { domain: 'WEAR', item: '배냇저고리·속싸개·손싸개·모자', reason: '체온 조절 미숙 + 태열 케어. 피부에 종일 닿는 품목.', priority: 'core' },
      { domain: 'WEAR', item: '가제 손수건·면 침구/이불', reason: '수유·목욕·태열 관리에 상시 사용. 순면 소재 권장.', priority: 'core' },
      { domain: 'LIFE', item: '엉덩이 발진크림·태열 진정 크림', reason: '신생아 피부 장벽 보호·태열 관리.', priority: 'core' },
      { domain: 'LIFE', item: '아기 워시/샴푸', reason: '목욕 세정. 저자극 성분 필요.', priority: 'core' },
      { domain: 'LIFE', item: '아기욕조', reason: '안전한 목욕 환경.', priority: 'optional' },
      { domain: 'SAFETY', item: '체온계', reason: '발열 모니터링 필수 도구(KC).', priority: 'core' },
      { domain: 'SAFETY', item: '콧물흡입기·습도계', reason: '호흡기·온습도 관리 보조.', priority: 'optional' },
      { domain: 'TOY', item: '흑백 모빌', reason: '시각 자극(흑백 대비)에 반응하는 시기.', priority: 'optional' },
      { domain: 'SLEEP', item: '수면 자루·백색소음기', reason: '수면 환경 조성 보조.', priority: 'optional' },
      { domain: 'SUPPLEMENT', item: '비타민D (400 IU/일)', reason: '모유·혼합수유아 출생 직후~12개월 보충 권고(대한소아청소년과학회·AAP). 분유 1L/일↑면 불필요.', priority: 'optional', behaviorTrigger: '모유·혼합수유 중' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 'first-smile',
    order: 1,
    label: '첫 웃음',
    monthRange: '2~4개월',
    ageMonths: { min: 2, max: 4 },
    developmentSummary: '오감 자극에 반응하고 목을 가누기 시작. 색을 인식하고 손을 뻗어 잡으려 함.',
    developmentKeywords: ['오감 자극', '목 가누기', '색상 인식', '손 뻗기'],
    careTransitions: [
      {
        domain: '수면',
        title: '수면 루틴 형성 시작',
        description: '낮밤 구분이 가능해지는 시기 — 수면 교육 시작 가능.',
      },
    ],
    essentialItems: [
      { domain: 'FOOD', item: '분유', reason: '이 시기 영양의 중심은 여전히 모유·분유. (수유 지속)', priority: 'core' },
      { domain: 'TOY', item: '컬러 모빌·손목 딸랑이', reason: '색상 인식·손 뻗기 발달 자극.', priority: 'core' },
      { domain: 'TOY', item: '바운서·배밀이 매트', reason: '목 가누기·몸 움직임 지지.', priority: 'optional' },
      { domain: 'WARE', item: '치발기', reason: '4~5개월 침 분비 증가·구강 탐색 시작.', priority: 'optional', behaviorTrigger: '침을 많이 흘려요' },
      { domain: 'SLEEP', item: '수면 자루·백색소음기', reason: '수면 루틴 형성 보조.', priority: 'optional' },
      { domain: 'TOY', item: '컬러 보드북·소리나는 책', reason: '청각·시각 자극, 의성어 반복.', priority: 'optional' },
      { domain: 'SUPPLEMENT', item: '비타민D (400 IU/일)', reason: '모유·혼합수유아 12개월까지 보충 지속 권고(대한소아청소년과학회·AAP).', priority: 'optional', behaviorTrigger: '모유·혼합수유 중' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 'rollover',
    order: 2,
    label: '뒤집기',
    monthRange: '5~8개월',
    ageMonths: { min: 5, max: 8 },
    developmentSummary:
      '뒤집고 혼자 앉기 시작. 양손 협응과 원인-결과를 인지. ★이유식을 시작하는 가장 강력한 구매 전환 시기.',
    developmentKeywords: ['뒤집기', '혼자 앉기', '양손 협응', '원인-결과 인지'],
    careTransitions: [
      {
        domain: '식이',
        title: '이유식 시작 (초기·중기)',
        description: '모유/분유 → 쌀미음·채소 퓨레 병행 시작. 6~9개월은 이유식 초중기.',
        isKeyTrigger: true,
      },
    ],
    essentialItems: [
      { domain: 'FOOD', item: '초기 이유식 (쌀미음·채소 퓨레)·시판 이유식', reason: '이유식 시작 시기. 첫 고형식 도입.', priority: 'core', behaviorTrigger: '이유식 시작했어요' },
      { domain: 'FOOD', item: '이유식 재료 (쌀·채소·단백질)', reason: '홈메이드 이유식용 식재료.', priority: 'core', behaviorTrigger: '이유식 시작했어요' },
      { domain: 'FOOD', item: '분유', reason: '이유식은 보충식 — 12개월 전까지 모유·분유가 영양 중심(하루 400ml 전후).', priority: 'core' },
      { domain: 'WARE', item: '이유식 조리기·냉동 큐브 트레이', reason: '이유식 조리·소분 보관 도구.', priority: 'core', behaviorTrigger: '이유식 시작했어요' },
      { domain: 'WARE', item: '소형 식판·유아 수저·실리콘 턱받이', reason: '이유식 먹이기 식기. 자기주도 식사 준비.', priority: 'core', behaviorTrigger: '이유식 시작했어요' },
      { domain: 'WARE', item: '빨대컵·치발기', reason: '수분 섭취 연습·구강 발달.', priority: 'optional' },
      { domain: 'TOY', item: '쌓기 링·소프트 블록·팝업 장난감·거울 장난감', reason: '양손 협응·원인-결과 인지 자극.', priority: 'optional' },
      { domain: 'TOY', item: '컬러 보드북·촉감책', reason: '사물 인식·촉각 자극.', priority: 'optional' },
      { domain: 'SUPPLEMENT', item: '비타민D (400 IU/일)', reason: '모유·혼합수유아 12개월까지 보충 지속 권고(대한소아청소년과학회·AAP).', priority: 'optional', behaviorTrigger: '모유·혼합수유 중' },
      { domain: 'SUPPLEMENT', item: '철분 (1 mg/kg/일)', reason: '모유수유아 4~6개월부터 철분강화 이유식 전까지 보충 권고. 분유수유아는 불필요.', priority: 'optional', behaviorTrigger: '모유수유 중' },
      { domain: 'SUPPLEMENT', item: '유아 유산균(프로바이오틱스)', reason: '건강한 만삭아 일상 보충은 권장되지 않음(AAP 2024) — 선택·개별 상담.', priority: 'optional' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 'crawling',
    order: 3,
    label: '기기',
    monthRange: '9~12개월',
    ageMonths: { min: 9, max: 12 },
    developmentSummary:
      '기어다니고 붙잡고 서기 시작. 손가락으로 집기(pincer grasp)와 대상영속성 발달. 손가락 음식 시작.',
    developmentKeywords: ['기기', '붙잡고 서기', '손가락 집기', '대상영속성'],
    careTransitions: [
      {
        domain: '식이',
        title: '이유식 후기 · 손가락 음식(finger food)',
        description: '으깬 식감 + 스스로 집어먹는 자기주도 이유식으로 전환.',
        isKeyTrigger: true,
      },
      {
        domain: '이동·신체',
        title: '기기 시작 — 안전 환경 필요',
        description: '바닥 이동 범위 확장으로 가정 내 안전 사고 위험 증가.',
        isKeyTrigger: true,
      },
    ],
    essentialItems: [
      { domain: 'FOOD', item: '후기 이유식·핑거푸드·유아간식', reason: '으깬 식감·자기주도 섭취 시기.', priority: 'core', behaviorTrigger: '손으로 집어먹어요' },
      { domain: 'FOOD', item: '분유', reason: '12개월 전까지 수유 지속 — 고형식↑ 수유↓.', priority: 'core' },
      { domain: 'WARE', item: '흡착 식판·오픈컵·자기주도 이유식 도구', reason: '엎지름 방지·스스로 먹기 연습.', priority: 'core' },
      { domain: 'SAFETY', item: '안전 게이트·바닥 매트·모서리 가드', reason: '기기·붙잡고 서기 시작 → 낙상·충돌 방지.', priority: 'core', behaviorTrigger: '기기 시작했어요' },
      { domain: 'TOY', item: '소팅 박스·컵 쌓기·당기기 장난감·첫 퍼즐(2~3조각)', reason: '손가락 집기·대상영속성 발달.', priority: 'optional' },
      { domain: 'TOY', item: '사물 그림책·촉감책', reason: '"이게 뭐야?" 가리키기 유도.', priority: 'optional' },
      { domain: 'SUPPLEMENT', item: '비타민D (400 IU/일)', reason: '모유·혼합수유아 12개월까지 보충 지속 권고(대한소아청소년과학회·AAP).', priority: 'optional', behaviorTrigger: '모유·혼합수유 중' },
      { domain: 'SUPPLEMENT', item: '철분 (1 mg/kg/일)', reason: '모유수유아 철분강화 이유식·육류 섭취 전까지 보충 권고. 충분 섭취 시 불필요.', priority: 'optional', behaviorTrigger: '모유수유 중' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 'first-steps',
    order: 4,
    label: '첫 걸음',
    monthRange: '13~18개월',
    ageMonths: { min: 13, max: 18 },
    developmentSummary: '혼자 걷기 시작하고 언어가 폭발적으로 성장. ★분유→우유 전환, 첫 신발 구매 전환 시기.',
    developmentKeywords: ['걷기', '언어 폭발', '모방'],
    careTransitions: [
      {
        domain: '식이',
        title: '분유 → 생우유 전환·유아식 합류',
        description: '분유 졸업, 가족 식사로 점진 합류. 빨대컵 → 오픈컵 전환.',
        isKeyTrigger: true,
      },
      {
        domain: '이동·신체',
        title: '첫 신발',
        description: '붙잡고 서기 → 걷기 → 첫 보행화 필요.',
        isKeyTrigger: true,
      },
      {
        domain: '수면',
        title: '낮잠 통합',
        description: '낮잠 2회 → 1회로 통합되는 시기.',
      },
    ],
    essentialItems: [
      { domain: 'FOOD', item: '생우유·유아식', reason: '분유 졸업, 가족 식사 합류.', priority: 'core', behaviorTrigger: '우유로 넘어갔어요' },
      { domain: 'WARE', item: '유아용 컵(빨대컵→오픈컵)·유아 수저·보조 식탁 의자', reason: '자기주도 식사 도구 업그레이드.', priority: 'core' },
      { domain: 'GEAR', item: '보행화 (발볼 넓은 유아화)', reason: '첫 걸음 시작 — 발 보호.', priority: 'core', behaviorTrigger: '걷기 시작했어요' },
      { domain: 'SLEEP', item: '낮잠 매트·암막 커튼', reason: '낮잠 통합 시기 수면 환경.', priority: 'optional' },
      { domain: 'TOY', item: '밀고당기기 장난감·두드리기 장난감·소꿉놀이 첫 단계·낙서 크레용', reason: '대근육 이동·모방·인과관계 학습.', priority: 'optional' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 'running',
    order: 5,
    label: '뛰기',
    monthRange: '19~36개월',
    ageMonths: { min: 19, max: 36 },
    developmentSummary: '달리고 2~3단어 문장을 구사. 상상력이 시작됨. ★배변훈련·기저귀 졸업 핵심 전환 시기.',
    developmentKeywords: ['달리기', '2~3단어 문장', '역할극', '상상력 시작'],
    careTransitions: [
      {
        domain: '위생·자립',
        title: '배변훈련 시작 → 기저귀 졸업',
        description: '신체 신호 인지 시작, 변기 도입 → 주간 기저귀 졸업.',
        isKeyTrigger: true,
      },
      {
        domain: '위생·자립',
        title: '혼자 양치 시도',
        description: '스스로 양치 시작 — 유아 칫솔·타이머.',
      },
    ],
    essentialItems: [
      { domain: 'LIFE', item: '유아 변기·변기 시트·보조 발판·팬티형 기저귀·유아 속옷', reason: '배변훈련 시작 시기.', priority: 'core', behaviorTrigger: '배변훈련 시작했어요' },
      { domain: 'LIFE', item: '방수 매트리스 커버·유아 전동칫솔·모래시계 타이머', reason: '배변 실수 대비·자립 양치.', priority: 'optional' },
      { domain: 'GEAR', item: '킥보드(2~3세용)·헬멧·보호대', reason: '스스로 이동 욕구 증가 — 안전 장비 동반.', priority: 'optional' },
      { domain: 'FOOD', item: '도시락통·유아 간식·물병', reason: '가족 식사 완전 합류·간식 루틴 정착.', priority: 'optional' },
      { domain: 'TOY', item: '역할극 소품(주방·의사)·블록·레고 듀플로·점토·퍼즐(6~12조각)', reason: '역할극·언어 폭발·상상력 발달.', priority: 'optional' },
    ],
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 'pretend-play',
    order: 6,
    label: '상상놀이',
    monthRange: '37~60개월',
    ageMonths: { min: 37, max: 60 },
    developmentSummary: '상상력·사회성·취학 준비 발달. 규칙을 이해하고 협동 놀이를 함. 낮잠 졸업, 혼자 씻기.',
    developmentKeywords: ['상상력', '사회성', '규칙 이해', '취학 준비'],
    careTransitions: [
      {
        domain: '수면',
        title: '낮잠 졸업·싱글 침대 전환',
        description: '낮잠 없이 야간 수면으로 통합.',
      },
      {
        domain: '위생·자립',
        title: '혼자 씻기',
        description: '스스로 손 씻기·샤워 보조.',
      },
    ],
    essentialItems: [
      { domain: 'GEAR', item: '세발자전거·균형 자전거(밸런스 바이크)', reason: '균형감각 발달.', priority: 'optional' },
      { domain: 'SLEEP', item: '싱글 침대·아동용 베개·이불', reason: '낮잠 졸업·침대 전환.', priority: 'optional' },
      { domain: 'LIFE', item: '아동 전용 스텝 스툴·유아 샴푸', reason: '혼자 씻기 자립 보조.', priority: 'optional' },
      { domain: 'TOY', item: '보드게임(단순 규칙)·미술도구 세트·과학 탐구 키트·알파벳 블록·유아 책상', reason: '규칙 이해·읽기 전 단계·취학 준비.', priority: 'optional' },
    ],
  },
];

/** id로 큐레이션 컨텐츠 조회 */
export function getCurationStage(id: CurationStageId): StageCurationContent | undefined {
  return CURATION_CONTENT.find((s) => s.id === id);
}

/** 월령(개월)으로 해당 큐레이션 구간 조회 */
export function getCurationStageByMonth(months: number): StageCurationContent | undefined {
  return CURATION_CONTENT.find((s) => months >= s.ageMonths.min && months <= s.ageMonths.max);
}

/** 특정 단계의 핵심(⭐꼭 필요) 아이템만 추출 */
export function getCoreItems(stage: StageCurationContent): EssentialItem[] {
  return stage.essentialItems.filter((i) => i.priority === 'core');
}

/** 특정 단계에서 실제로 노출할 전체 아이템 = 전 단계 공통 상시 소모품 + 단계별 아이템 */
export function getAllItemsForStage(stage: StageCurationContent): EssentialItem[] {
  return [...COMMON_ITEMS, ...stage.essentialItems];
}
