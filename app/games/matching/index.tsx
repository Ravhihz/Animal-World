import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing, sizing, shadows } from '../../../src/theme/spacing';
import { matchingLevels } from '../../../src/data/levels';
import { MatchingGame } from '../../../src/modules/matching/MatchingGame';
import { CelebrationOverlay } from '../../../src/components/CelebrationOverlay';
import { RewardService } from '../../../src/services/RewardService';
import { Badge } from '../../../src/data/badges';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { useProgressStore } from '../../../src/store/useProgressStore';

const { width } = Dimensions.get('window');

type Screen = 'level_select' | 'game';

const LEVEL_CONFIG = [
  { id: 'easy',   emoji: '😊', label: 'Mudah',  pairCount: 2, color: colors.menuAnimals,  dark: colors.menuAnimalsDark },
  { id: 'medium', emoji: '😄', label: 'Sedang', pairCount: 3, color: colors.menuMatching, dark: colors.menuMatchingDark },
  { id: 'hard',   emoji: '😎', label: 'Sulit',  pairCount: 4, color: colors.menuColoring, dark: colors.menuColoringDark },
];

function LevelCard({ cfg, onPress }: { cfg: typeof LEVEL_CONFIG[0]; onPress: () => void }) {
  const scale = useSharedValue(1);
  const y = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: y.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); y.value = withSpring(3); }}
      onPressOut={() => { scale.value = withSpring(1); y.value = withSpring(0); }}
      activeOpacity={1}
    >
      <Animated.View style={[styles.levelCard, anim, shadows.md]}>
        {/* Color header */}
        <View style={[styles.levelCardTop, { backgroundColor: cfg.color }]}>
          <Text style={styles.levelCardEmoji}>{cfg.emoji}</Text>
        </View>
        {/* Footer */}
        <View style={[styles.levelCardBot, { backgroundColor: cfg.dark }]}>
          <Text style={styles.levelCardLabel}>{cfg.label}</Text>
          <View style={styles.levelCardPairs}>
            {Array.from({ length: cfg.pairCount }).map((_, i) => (
              <View key={i} style={styles.levelPairDot} />
            ))}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function MatchingScreen() {
  const { t } = useTranslation();
  const totalStars = useProgressStore((s) => s.totalStars);

  const [screen, setScreen] = useState<Screen>('level_select');
  const [pairCount, setPairCount] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rewardStars, setRewardStars] = useState<1 | 2 | 3>(1);
  const [rewardBadges, setRewardBadges] = useState<Badge[]>([]);
  const [rewardAnimals, setRewardAnimals] = useState<string[]>([]);
  const [gameKey, setGameKey] = useState(0);

  const handleGameComplete = async (wrongAnswers: number) => {
    const result = await RewardService.processActivityCompletion('matching', { wrongAnswers });
    setRewardStars(result.stars);
    setRewardBadges(result.newBadges);
    setRewardAnimals(result.newAnimals);
    setShowCelebration(true);
  };

  const handleContinue = () => {
    setShowCelebration(false);
    setScreen('level_select');
  };

  const handlePlayAgain = () => {
    setShowCelebration(false);
    setGameKey((k) => k + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with score */}
      <View style={styles.headerBar}>
        <ScreenHeader
          title={`🎯 ${t('matching.title')}`}
          onBack={() => screen === 'game' ? setScreen('level_select') : router.back()}
          bgColor="transparent"
          style={{ flex: 1, paddingHorizontal: 0 }}
        />
        {/* Stars counter */}
        <View style={styles.starsChip}>
          <Text style={styles.starsText}>⭐ {totalStars}</Text>
        </View>
      </View>

      {screen === 'level_select' ? (
        <View style={styles.levelSelect}>
          <Text style={styles.levelSelectTitle}>Pilih Tingkat Kesulitan</Text>
          <Text style={styles.levelSelectSub}>Cocokkan gambar hewan dengan bayangannya!</Text>

          <View style={styles.levelGrid}>
            {LEVEL_CONFIG.map((cfg) => (
              <LevelCard
                key={cfg.id}
                cfg={cfg}
                onPress={() => {
                  setPairCount(cfg.pairCount);
                  setGameKey((k) => k + 1);
                  setScreen('game');
                }}
              />
            ))}
          </View>
        </View>
      ) : (
        <MatchingGame
          key={gameKey}
          pairCount={pairCount}
          onComplete={handleGameComplete}
        />
      )}

      <CelebrationOverlay
        visible={showCelebration}
        stars={rewardStars}
        title={t('matching.complete')}
        newBadges={rewardBadges}
        newAnimals={rewardAnimals}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgMain },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
  },
  starsChip: {
    backgroundColor: colors.accent,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    ...shadows.sm,
  },
  starsText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.text,
  },
  levelSelect: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  levelSelectTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  levelSelectSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.label,
    color: colors.textLight,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  levelGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  levelCard: {
    width: (width - spacing.lg * 2 - spacing.md * 2) / 3,
    borderRadius: sizing.borderRadius.lg,
    overflow: 'hidden',
  },
  levelCardTop: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCardEmoji: { fontSize: 44 },
  levelCardBot: {
    padding: spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  levelCardLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textWhite,
  },
  levelCardPairs: {
    flexDirection: 'row',
    gap: 4,
  },
  levelPairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});
