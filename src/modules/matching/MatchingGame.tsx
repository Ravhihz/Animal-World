import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, sizing, shadows } from '../../theme/spacing';
import { useMatchingLogic, MatchPair } from './useMatchingLogic';

const { width } = Dimensions.get('window');
const MAX_COLS = 4;
const CHIP_SIZE = Math.min(Math.floor((width - spacing.lg * 2 - spacing.sm * (MAX_COLS - 1)) / MAX_COLS), 82);

// ── Animal Chip ───────────────────────────────────────────────────────────────

function AnimalChip({ pair, isSelected, isMatched, onPress }: {
  pair: MatchPair; isSelected: boolean; isMatched: boolean; onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  React.useEffect(() => {
    if (isMatched) {
      scale.value = withSequence(withSpring(1.18, { damping: 6 }), withSpring(1));
    }
  }, [isMatched]);

  return (
    <Animated.View style={anim}>
      <TouchableOpacity
        style={[
          styles.chip,
          { width: CHIP_SIZE, height: CHIP_SIZE },
          isMatched && styles.chipMatched,
          isSelected && styles.chipSelected,
        ]}
        onPress={onPress}
        disabled={isMatched}
        activeOpacity={0.85}
      >
        <Text style={{ fontSize: CHIP_SIZE * 0.56 }}>{pair.emoji}</Text>
        {isMatched && (
          <View style={styles.matchedBadge}>
            <Text style={styles.matchedCheck}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Silhouette Slot ───────────────────────────────────────────────────────────

function SilhouetteSlot({ pair, isMatched, isWrong, onPress }: {
  pair: MatchPair; isMatched: boolean; isWrong: boolean; onPress: () => void;
}) {
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  React.useEffect(() => {
    if (isWrong) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 55 }), withTiming(10, { duration: 55 }),
        withTiming(-7, { duration: 55 }),  withTiming(7, { duration: 55 }),
        withTiming(0, { duration: 55 })
      );
    }
  }, [isWrong]);

  return (
    <Animated.View style={shakeStyle}>
      <TouchableOpacity
        style={[
          styles.slot,
          { width: CHIP_SIZE, height: CHIP_SIZE },
          isMatched && styles.slotMatched,
          isWrong && styles.slotWrong,
        ]}
        onPress={onPress}
        disabled={isMatched}
        activeOpacity={0.85}
      >
        {isMatched ? (
          <Text style={{ fontSize: CHIP_SIZE * 0.56 }}>{pair.emoji}</Text>
        ) : (
          // Silhouette: darkened emoji
          <Text style={{ fontSize: CHIP_SIZE * 0.56, opacity: 0.18 }}>{pair.emoji}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main MatchingGame ─────────────────────────────────────────────────────────

interface MatchingGameProps {
  pairCount: number;
  onComplete: (wrongAnswers: number) => void;
}

export function MatchingGame({ pairCount, onComplete }: MatchingGameProps) {
  const {
    pairs,
    silhouettes,
    matched,
    selected,
    wrongAnswers,
    lastWrong,
    isComplete,
    selectCard,
    tryMatch,
  } = useMatchingLogic(pairCount);

  React.useEffect(() => {
    if (isComplete) onComplete(wrongAnswers);
  }, [isComplete]);

  const totalPairs = pairs.length;
  const matchedCount = matched.size;
  const progressPct = Math.round((matchedCount / totalPairs) * 100);

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{matchedCount}/{totalPairs}</Text>
      </View>

      {/* Instruction */}
      <Text style={styles.instruction}>
        {selected ? '👆 Tap bayangannya!' : '👆 Pilih hewan dulu!'}
      </Text>

      {/* Animal cards */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🐾 Hewan</Text>
        <View style={styles.row}>
          {pairs.map((pair) => (
            <AnimalChip
              key={pair.animalId}
              pair={pair}
              isSelected={selected === pair.animalId}
              isMatched={matched.has(pair.animalId)}
              onPress={() => selectCard(pair.animalId)}
            />
          ))}
        </View>
      </View>

      {/* Divider arrow */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerArrow}>↕</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Silhouette slots */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🌑 Bayangan</Text>
        <View style={styles.row}>
          {silhouettes.map((sil) => (
            <SilhouetteSlot
              key={sil.animalId}
              pair={sil}
              isMatched={matched.has(sil.animalId)}
              isWrong={lastWrong === sil.animalId}
              onPress={() => tryMatch(sil.animalId)}
            />
          ))}
        </View>
      </View>

      {/* Wrong counter */}
      {wrongAnswers > 0 && (
        <View style={styles.wrongPill}>
          <Text style={styles.wrongText}>❌ {wrongAnswers}× salah — tidak apa-apa, coba lagi!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: colors.border,
    borderRadius: sizing.borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: sizing.borderRadius.full,
  },
  progressLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textMedium,
    minWidth: 32,
    textAlign: 'right',
  },

  instruction: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.label,
    color: colors.textLight,
    textAlign: 'center',
  },

  section: {
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: colors.textLight,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: colors.bgMain,
    borderRadius: sizing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.border,
    ...shadows.sm,
    position: 'relative',
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
    ...shadows.md,
  },
  chipMatched: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  matchedBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchedCheck: {
    fontSize: 10,
    color: colors.textWhite,
    fontFamily: typography.fontFamily.bold,
  },

  slot: {
    backgroundColor: colors.bgMain,
    borderRadius: sizing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  slotMatched: {
    borderStyle: 'solid',
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  slotWrong: {
    borderStyle: 'solid',
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.border,
  },
  dividerArrow: {
    fontSize: 20,
    color: colors.textLight,
  },

  wrongPill: {
    backgroundColor: colors.errorLight,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'center',
  },
  wrongText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.small,
    color: colors.error,
    textAlign: 'center',
  },
});
