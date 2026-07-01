/**
 * 안심점수 배지 (안심 기준 정리.md §1, §10)
 * 예: 🟢 안심 88
 */

import { StyleSheet, Text, View } from 'react-native';
import type { SafetyScore } from '@/domain/types';
import { GRADE_META } from '@/features/safety-score';
import { radius, spacing, typography } from '@/theme';

interface Props {
  result: SafetyScore;
  size?: 'sm' | 'lg';
}

export function SafetyScoreBadge({ result, size = 'sm' }: Props) {
  const meta = GRADE_META[result.grade];
  const isLarge = size === 'lg';

  return (
    <View style={[styles.badge, { backgroundColor: meta.color }, isLarge && styles.badgeLarge]}>
      <Text style={[styles.label, isLarge && styles.labelLarge]}>
        {meta.emoji} {meta.label}
      </Text>
      <Text style={[styles.score, isLarge && styles.scoreLarge]}>{result.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeLarge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    color: '#FFFFFF',
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  labelLarge: {
    fontSize: typography.body.fontSize,
  },
  score: {
    color: '#FFFFFF',
    fontSize: typography.body.fontSize,
    fontWeight: '800',
  },
  scoreLarge: {
    fontSize: typography.score.fontSize,
  },
});
