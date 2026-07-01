# baby-app · mobile (데모)

육아용품 **안심 큐레이션** 앱의 모바일 데모입니다.
**스코프다운 1차 데모: 6개월 영아 × 식품(FOOD) 카테고리.**

- 플랫폼: **React Native + Expo** (Expo Router 파일 기반 라우팅)
- 언어: TypeScript
- 컨셉: "지금 우리 아이에게 꼭 필요한 식품만 골라주고", 성분을 읽어 **✓ 안심특징 / ✕ 걱정요소**와 **안심점수**를 보여준 뒤 구매처로 연결.

> 평가 모델은 본래 ① 성분 안심점수 + ② 신뢰 지표 두 갈래지만,
> **FOOD 카테고리에서는 ② 신뢰 지표를 사용하지 않고 ① 성분 안심점수만** 사용합니다.
> 인증(HACCP·유기농·품질인증)은 FOOD ✓ 안심특징에 포함되어 가점으로 반영됩니다.

---

## 폴더 구조

```
mobile/
├── app/                          # Expo Router 화면 (파일 기반 라우팅)
│   ├── _layout.tsx               # 루트 네비게이션
│   ├── index.tsx                 # 홈: 6개월 FOOD 큐레이션 목록
│   ├── product/
│   │   └── [id].tsx              # 제품 상세 카드
│   └── +not-found.tsx
├── src/
│   ├── domain/                   # 도메인 타입·상수 (UI/프레임워크 무관)
│   │   ├── types.ts              # Product, IngredientFlag, SafetyScore ...
│   │   └── constants.ts          # FOOD 안심/걱정 사전, 기준선, 점수 가중치
│   ├── features/
│   │   ├── safety-score/         # 안심점수 계산 로직
│   │   │   ├── calculateSafetyScore.ts
│   │   │   └── grade.ts          # 🟢🟡🟠🔴 등급 메타
│   │   └── curation/             # 월령 단계 정의 + 제품 셀렉터
│   │       ├── stages.ts
│   │       └── selectors.ts
│   ├── components/
│   │   ├── product/              # ProductCard, SafetyScoreBadge, IngredientSafetySection
│   │   ├── common/               # (예정) 버튼·배지 등 공통 UI
│   │   └── layout/               # (예정) 레이아웃 컴포넌트
│   ├── data/
│   │   └── mock/
│   │       └── products.food.ts  # 데모용 FOOD 가상 제품
│   ├── theme/                    # 컬러·타이포·간격 토큰
│   └── lib/
│       └── affiliate.ts          # 구매처 제휴 링크 헬퍼
├── assets/                       # 이미지·아이콘
├── app.json                      # Expo 설정
├── package.json
├── tsconfig.json                 # 경로 alias: @/* → src/*
└── babel.config.js
```

### 레이어 원칙

- **domain** — 순수 타입·상수. 어떤 프레임워크에도 의존하지 않음. (테스트하기 쉬움)
- **features** — 비즈니스 로직(안심점수·큐레이션). React에 거의 의존하지 않음.
- **components** — 화면을 구성하는 재사용 UI.
- **app** — Expo Router 화면. features/components를 조합만 함.
- **data/mock** — 데모 데이터. 추후 실제 API/공공데이터 수집으로 교체.

---

## 실행 방법

> ⚠️ 아직 Node.js / 의존성이 설치되지 않았습니다. 아래 순서로 준비하세요.

```bash
# 1) Node.js LTS 설치 (https://nodejs.org)
# 2) 의존성 설치
cd mobile
npm install

# 3) 개발 서버 실행 (휴대폰 Expo Go 앱으로 QR 스캔)
npm start

# 타입 체크
npm run typecheck
```

---

## 안심점수 계산 (요약)

`src/features/safety-score/calculateSafetyScore.ts`

- 기준점 **100**에서 시작
- 걱정요소 감점: 고위험 **-25** / 중위험 **-15** / 경위험 **-7**
- 안심특징 가점: 핵심 인증 **+10** / 일반 안심 표시 **+3**
- 등급: 🟢안심 90+ / 🟡양호 70+ / 🟠주의 50+ / 🔴경고 50 미만
- **안전장치:** 전성분 미표기 제품은 ✓ 안심특징 가점을 받지 못함 (정보 없음 ≠ 안심)

근거: `../리서치/안심 기준 정리.md`, `../리서치/월령별_발달단계_리서치.md`

---

## 다음 단계 (TODO)

- [ ] Node 설치 후 `npm install` + Expo 프로젝트 정상 부팅 확인
- [ ] 안심점수 로직 단위 테스트 추가
- [ ] 제품 이미지 연동 (현재 텍스트만)
- [ ] 실제 데이터 수집 파이프라인(공공데이터·바코드·OCR) 연결
- [ ] 카테고리 확장(WARE/TOY/LIFE) 시 ② 신뢰 지표 모델 재도입
