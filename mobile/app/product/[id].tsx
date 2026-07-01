/**
 * 제품 상세 화면 — 카드 UI 표시 모델 (안심 기준 정리.md §10)
 *   제품명 + 안심점수 → ① 성분 안심 → 🛒 구매처로 가기
 */

import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IngredientSafetySection, SafetyScoreBadge } from '@/components/product';
import { getProductById } from '@/features/curation';
import { calculateSafetyScore } from '@/features/safety-score';
import { openAffiliateLink } from '@/lib/affiliate';
import { colors, radius, spacing, typography } from '@/theme';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>제품을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const result = calculateSafetyScore(product);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.subCategory}>{product.subCategory}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.brand}>{product.brand}</Text>
          </View>
          <SafetyScoreBadge result={result} size="lg" />
        </View>

        <View style={styles.divider} />

        <IngredientSafetySection
          flags={product.ingredientFlags}
          hasFullIngredientList={product.hasFullIngredientList}
        />

        {product.nutrition && (
          <View style={styles.nutrition}>
            <Text style={styles.nutritionLabel}>
              나트륨 {product.nutrition.sodiumMg ?? '–'}mg · 당류{' '}
              {product.nutrition.sugarG ?? '–'}g · 원재료{' '}
              {product.nutrition.ingredientCount ?? '–'}개
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <Pressable
          style={({ pressed }) => [styles.buyButton, pressed && styles.pressed]}
          onPress={() => openAffiliateLink(product.affiliateUrl)}
        >
          <Text style={styles.buyText}>🛒 구매처로 가기</Text>
        </Pressable>
        <Text style={styles.disclaimer}>제휴 수수료는 안심점수에 영향을 주지 않습니다.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  titleBlock: { flex: 1, gap: spacing.xs },
  subCategory: { ...typography.caption, color: colors.brand.primary, fontWeight: '700' },
  name: { ...typography.title, color: colors.text.primary },
  brand: { ...typography.body, color: colors.text.secondary },
  divider: { height: 1, backgroundColor: colors.border },
  nutrition: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  nutritionLabel: { ...typography.caption, color: colors.text.secondary },
  buyButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pressed: { opacity: 0.8 },
  buyText: { color: '#FFFFFF', ...typography.heading },
  disclaimer: { ...typography.caption, color: colors.text.muted, textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.text.secondary },
});
