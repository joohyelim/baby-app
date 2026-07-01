/**
 * 홈 화면 — 6개월(이유 초중기) FOOD 큐레이션 목록
 */

import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Product } from '@/domain/types';
import { ProductCard } from '@/components/product';
import { DEMO_STAGE_ID, getFoodProductsForStage, getStage } from '@/features/curation';
import { colors, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const stage = getStage(DEMO_STAGE_ID);
  const products = getFoodProductsForStage(DEMO_STAGE_ID);

  const goToProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>지금 우리 아이에게 필요한 식품</Text>
          {stage && (
            <Text style={styles.subtitle}>
              {stage.monthRange} · {stage.label} · {stage.feeding}
            </Text>
          )}
        </View>
      }
      renderItem={({ item }) => <ProductCard product={item} onPress={goToProduct} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  header: { marginBottom: spacing.lg, gap: spacing.xs },
  title: { ...typography.title, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary },
});
