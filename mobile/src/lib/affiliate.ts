/**
 * 구매처 제휴 링크 헬퍼 (안심 기준 정리.md §10)
 * "구매처로 가기"는 제휴 링크로 연결하되, 제휴 수수료는 안심점수에 영향을 주지 않습니다.
 */

import { Linking } from 'react-native';

export async function openAffiliateLink(url?: string): Promise<void> {
  if (!url) return;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
}
