/**
 * 등급별 표시 메타데이터 (이모지·색·라벨)
 * 안심 기준 정리.md §2: 🟢안심 / 🟡양호 / 🟠주의 / 🔴경고
 */

import type { SafetyGrade } from '@/domain/types';
import { colors } from '@/theme/colors';

interface GradeMeta {
  label: string;
  emoji: string;
  color: string;
}

export const GRADE_META: Record<SafetyGrade, GradeMeta> = {
  safe: { label: '안심', emoji: '🟢', color: colors.grade.safe },
  good: { label: '양호', emoji: '🟡', color: colors.grade.good },
  caution: { label: '주의', emoji: '🟠', color: colors.grade.caution },
  warning: { label: '경고', emoji: '🔴', color: colors.grade.warning },
};
