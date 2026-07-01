/** 컬러 토큰 — 화해/컬리류 커머스 톤의 밝고 따뜻한 팔레트 */

export const colors = {
  background: '#FFFFFF',
  surface: '#F7F8FA',
  border: '#ECECEE',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },
  brand: {
    primary: '#FF7A59', // 따뜻한 코랄 (육아·포근 톤)
    soft: '#FFF0EB',
  },
  // 안심점수 등급 색 (🟢🟡🟠🔴)
  grade: {
    safe: '#16A34A',
    good: '#EAB308',
    caution: '#F97316',
    warning: '#DC2626',
  },
  // 플래그 표시
  flag: {
    safe: '#16A34A', // ✓
    concern: '#DC2626', // ✕
  },
} as const;
