import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>페이지를 찾을 수 없습니다.</Text>
      <Link href="/" style={styles.link}>
        홈으로 돌아가기
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  text: { ...typography.body, color: colors.text.secondary },
  link: { ...typography.body, color: colors.brand.primary, fontWeight: '700' },
});
