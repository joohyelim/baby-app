/**
 * ① 성분 안심 섹션 (안심 기준 정리.md §10)
 * ✓ 안심특징 / ✕ 걱정요소를 한 줄씩 표시합니다.
 */

import { StyleSheet, Text, View } from 'react-native';
import type { IngredientFlag } from '@/domain/types';
import { colors, spacing, typography } from '@/theme';

interface Props {
  flags: IngredientFlag[];
  hasFullIngredientList: boolean;
}

export function IngredientSafetySection({ flags, hasFullIngredientList }: Props) {
  const safe = flags.filter((f) => f.kind === 'safe');
  const concern = flags.filter((f) => f.kind === 'concern');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>① 성분 안심</Text>

      {!hasFullIngredientList && (
        <Text style={styles.notice}>⚠️ 전성분 미표기 — 안심특징 점수 미반영</Text>
      )}

      <View style={styles.flags}>
        {safe.map((f) => (
          <Text key={f.label} style={[styles.flag, styles.safe]}>
            ✓ {f.label}
            {f.certification ? ' ·인증' : ''}
          </Text>
        ))}
        {concern.map((f) => (
          <Text key={f.label} style={[styles.flag, styles.concern]}>
            ✕ {f.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  heading: { ...typography.heading, color: colors.text.primary },
  notice: { ...typography.caption, color: colors.grade.caution },
  flags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  flag: {
    ...typography.caption,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    overflow: 'hidden',
  },
  safe: { color: colors.flag.safe, backgroundColor: '#ECFDF3' },
  concern: { color: colors.flag.concern, backgroundColor: '#FEF2F2' },
});
