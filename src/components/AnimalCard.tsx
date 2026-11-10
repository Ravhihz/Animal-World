import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { sizing, spacing, shadows } from '../theme/spacing';
import { Animal } from '../data/animals';
import { useProgressStore } from '../store/useProgressStore';

interface AnimalCardProps {
  animal: Animal;
  onPress?: (animal: Animal) => void;
  size?: number;
  showName?: boolean;
  style?: ViewStyle;
  forceUnlocked?: boolean;
}

// Vibrant gradient pairs per category
const CATEGORY_STYLES: Record<string, { top: string; bottom: string; shimmer: string }> = {
  land: { top: '#A8E063', bottom: '#56AB2F', shimmer: 'rgba(255,255,180,0.5)' },
  sea:  { top: '#43E0F5', bottom: '#1565C0', shimmer: 'rgba(180,255,255,0.5)' },
  air:  { top: '#FF9AE2', bottom: '#B91FBF', shimmer: 'rgba(255,200,255,0.5)' },
};

export function AnimalCard({
  animal,
  onPress,
  size = sizing.cardSize,
  showName = true,
  style,
  forceUnlocked = false,
}: AnimalCardProps) {
  const unlockedAnimals = useProgressStore((s) => s.unlockedAnimals);
  const isUnlocked = forceUnlocked || unlockedAnimals.includes(animal.id);

  const translateY = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const shimmerX = useSharedValue(-size);

  const catStyle = CATEGORY_STYLES[animal.category] ?? CATEGORY_STYLES.land;

  useEffect(() => {
    if (isUnlocked) {
      // Gentle float
      translateY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      // Shimmer sweep (runs once every 4s)
      const runShimmer = () => {
        shimmerX.value = -size;
        shimmerX.value = withTiming(size * 2, { duration: 900, easing: Easing.inOut(Easing.quad) });
        setTimeout(runShimmer, 4000);
      };
      const t = setTimeout(runShimmer, Math.random() * 2000);
      return () => clearTimeout(t);
    }
  }, [isUnlocked, size]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: pressScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const handlePressIn = () => { pressScale.value = withSpring(0.91, { damping: 18 }); };
  const handlePressOut = () => { pressScale.value = withSpring(1, { damping: 14 }); };

  return (
    <TouchableOpacity
      onPress={() => isUnlocked && onPress?.(animal)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.wrapper, style]}
      accessibilityLabel={`${animal.nameId}${!isUnlocked ? ', terkunci' : ''}`}
      accessibilityRole="button"
    >
      <Animated.View style={floatStyle}>
        {/* Card face */}
        <View
          style={[
            styles.card,
            {
              width: size,
              height: size,
              backgroundColor: isUnlocked ? catStyle.top : colors.lockedBg,
              borderRadius: sizing.borderRadius.lg,
            },
            shadows.md,
          ]}
        >
          {/* Bottom color strip (gradient simulation) */}
          <View
            style={[
              styles.bottomStrip,
              {
                backgroundColor: isUnlocked ? catStyle.bottom : colors.locked,
                borderBottomLeftRadius: sizing.borderRadius.lg,
                borderBottomRightRadius: sizing.borderRadius.lg,
                height: size * 0.28,
              },
            ]}
          />

          {/* Shimmer overlay */}
          {isUnlocked && (
            <Animated.View
              style={[
                styles.shimmer,
                { borderRadius: sizing.borderRadius.lg },
                shimmerStyle,
              ]}
            />
          )}

          {/* Emoji */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.emojiWrapper}>
              <Text style={{ fontSize: size * 0.52 }}>
                {isUnlocked ? animal.emoji : '🔒'}
              </Text>
            </View>
          </View>

          {/* Lock cost badge */}
          {!isUnlocked && (
            <View style={styles.lockBadge}>
              <Text style={styles.lockText}>⭐{animal.unlockCost}</Text>
            </View>
          )}

          {/* Category dot */}
          {isUnlocked && (
            <View style={[styles.categoryDot, { backgroundColor: catStyle.bottom }]} />
          )}
        </View>

        {/* Name below */}
        {showName && (
          <View style={styles.nameContainer}>
            <Text style={styles.nameId} numberOfLines={1}>{animal.nameId}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    margin: spacing.xs + 2,
  },
  card: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: [{ skewX: '-20deg' }],
  },
  emojiWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  lockText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: colors.textWhite,
  },
  categoryDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
  nameContainer: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  nameId: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.text,
  },
});
