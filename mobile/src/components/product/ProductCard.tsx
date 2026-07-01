/**
 * 제품 카드 (안심 기준 정리.md §10 카드 UI 표시 모델)
 * 목록에서 한 제품을 요약해 보여주고, 탭하면 상세로 이동합니다.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '@/domain/types';
import { calculateSafetyScore } from '@/features/safety-score';
import { colors, radius, spacing, typography } from '@/theme';
import { SafetyScoreBadge } from './SafetyScoreBadge';

interface Props {
  product: Product;
  onPress?: (product: Product) => void;
}

export function ProductCard({ product, onPress }: Props) {
  const result = calculateSafetyScore(product);
  const topConcern = product.ingredientFlags.find((f) => f.kind === 'concern');
  const topSafe = product.ingredientFlags.find((f) => f.kind === 'safe');

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress?.(product)}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.subCategory}>{product.subCategory}</Text>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.brand}>{product.brand}</Text>
        </View>
        <SafetyScoreBadge result={result} />
      </View>

      <View style={styles.flagRow}>
        {topSafe && <Text style={styles.safe}>✓ {topSafe.label}</Text>}
        {topConcern && <Text style={styles.concern}>✕ {topConcern.label}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  pressed: { opacity: 0.7 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  titleBlock: { flex: 1, gap: 2 },
  subCategory: { ...typography.caption, color: colors.brand.primary, fontWeight: '700' },
  name: { ...typography.heading, color: colors.text.primary },
  brand: { ...typography.caption, color: colors.text.secondary },
  flagRow: { flexDirection: 'row', gap: spacing.md },
  safe: { ...typography.caption, color: colors.flag.safe },
  concern: { ...typography.caption, color: colors.flag.concern },
});
