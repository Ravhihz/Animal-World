import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, sizing, shadows } from '../theme/spacing';
import { StarReward } from './StarReward';
import { BigButton } from './BigButton';
import { Badge } from '../data/badges';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

// ── Confetti piece ────────────────────────────────────────────────────────────
const CONFETTI_ITEMS = ['⭐', '🎉', '✨', '🌟', '💫', '🎊', '🎈', '🏆', '🌈', '💥', '🎯', '🎀'];
const CONFETTI_COLORS = [
  colors.primary, colors.secondary, colors.accent,
  colors.menuAnimals, colors.menuMatching, colors.menuColoring, colors.menuPuzzle,
];

function ConfettiPiece({ index, totalCount }: { index: number; totalCount: number }) {
  const item = CONFETTI_ITEMS[index % CONFETTI_ITEMS.length];
  const startX = (index / totalCount) * width * 1.1 - width * 0.05;
  const delay = index * 55;

  const y = useSharedValue(-60);
  const x = useSharedValue(startX);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue('0deg');
  const scale = useSharedValue(0.6 + Math.random() * 0.8);

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 120;
    y.value = withDelay(delay, withTiming(height * 0.9, { duration: 2500 }));
    x.value = withDelay(delay, withTiming(startX + drift, { duration: 2500 }));
    opacity.value = withDelay(delay + 1800, withTiming(0, { duration: 700 }));
    rotate.value = withDelay(delay, withTiming(`${(Math.random() - 0.5) * 720}deg`, { duration: 2500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: rotate.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.confetti, style]}>{item}</Animated.Text>
  );
}

// ── Main overlay ──────────────────────────────────────────────────────────────
interface CelebrationOverlayProps {
  visible: boolean;
  stars: 1 | 2 | 3;
  title?: string;
  newBadges?: Badge[];
  newAnimals?: string[];
  onContinue: () => void;
}

export function CelebrationOverlay({
  visible,
  stars,
  title,
  newBadges = [],
  newAnimals = [],
  onContinue,
}: CelebrationOverlayProps) {
  const { t } = useTranslation();

  const cardScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const bounce = useSharedValue(0);
  const emojiScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      cardScale.value = withDelay(150, withSpring(1, { damping: 10, stiffness: 180 }));
      cardOpacity.value = withDelay(150, withTiming(1, { duration: 250 }));

      // Bounce title
      bounce.value = withDelay(500, withSequence(
        withSpring(-12, { damping: 6 }),
        withSpring(0, { damping: 8 })
      ));

      // Pulsing celebration emoji
      emojiScale.value = withDelay(300, withRepeat(
        withSequence(
          withSpring(1.2, { damping: 6 }),
          withSpring(1, { damping: 8 })
        ),
        3,
        true
      ));
    } else {
      cardScale.value = withTiming(0.8, { duration: 180 });
      cardOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const TOTAL_CONFETTI = 24;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        {/* Confetti burst */}
        {visible && Array.from({ length: TOTAL_CONFETTI }).map((_, i) => (
          <ConfettiPiece key={i} index={i} totalCount={TOTAL_CONFETTI} />
        ))}

        <Animated.View style={[styles.card, cardStyle]}>
          {/* Top rainbow bar */}
          <View style={styles.rainbowBar}>
            {CONFETTI_COLORS.map((c, i) => (
              <View key={i} style={[styles.rainbowSegment, { backgroundColor: c }]} />
            ))}
          </View>

          {/* Emoji */}
          <Animated.Text style={[styles.celebEmoji, emojiStyle]}>🎉</Animated.Text>

          {/* Title */}
          <Animated.Text style={[styles.title, bounceStyle]}>
            {title ?? t('matching.complete')}
          </Animated.Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            <StarReward stars={stars} size={44} animated />
          </View>

          {/* Stars count */}
          <View style={styles.starsBadge}>
            <Text style={styles.starsBadgeText}>+{stars} ⭐</Text>
          </View>

          {/* New badges */}
          {newBadges.length > 0 && (
            <View style={styles.newItemsRow}>
              {newBadges.map((badge) => (
                <View key={badge.id} style={styles.newItemChip}>
                  <Text style={styles.newItemEmoji}>{badge.emoji}</Text>
                  <Text style={styles.newItemLabel}>{t('reward.newBadge')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* New animals */}
          {newAnimals.length > 0 && (
            <View style={styles.newItemsRow}>
              {newAnimals.map((id) => (
                <View key={id} style={[styles.newItemChip, { backgroundColor: colors.land }]}>
                  <Text style={styles.newItemEmoji}>🐾</Text>
                  <Text style={styles.newItemLabel}>{t('reward.newAnimal')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Continue button */}
          <BigButton
            label={t('reward.continue')}
            onPress={onContinue}
            variant="primary"
            size="lg"
            style={styles.continueBtn}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,15,40,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti: {
    position: 'absolute',
    fontSize: 22,
    top: 0,
    left: 0,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.xl,
    width: width * 0.86,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: spacing.xl,
    ...shadows.xl,
  },
  rainbowBar: {
    flexDirection: 'row',
    height: 8,
    width: '100%',
    marginBottom: spacing.lg,
  },
  rainbowSegment: {
    flex: 1,
  },
  celebEmoji: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  starsRow: {
    marginBottom: spacing.sm,
  },
  starsBadge: {
    backgroundColor: colors.accent,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  starsBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  newItemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  newItemChip: {
    backgroundColor: colors.accent,
    borderRadius: sizing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  newItemEmoji: { fontSize: 20 },
  newItemLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: colors.text,
  },
  continueBtn: {
    marginTop: spacing.md,
    marginHorizontal: spacing.xl,
    width: width * 0.86 - spacing.xl * 2,
  },
});
