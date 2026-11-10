import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, sizing, shadows } from '../../src/theme/spacing';
import { getAnimalById } from '../../src/data/animals';
import { AudioButton } from '../../src/components/AudioButton';
import { audioManager } from '../../src/services/AudioManager';
import { useAppStore } from '../../src/store/useAppStore';
import { useProgressStore } from '../../src/store/useProgressStore';
import { ScreenHeader } from '../../src/components/ScreenHeader';

const { width } = Dimensions.get('window');

const CATEGORY_CONFIG = {
  land: { bgTop: colors.land,      bgBot: colors.landDark,  textColor: '#1B5E20' },
  sea:  { bgTop: colors.sea,       bgBot: colors.seaDark,   textColor: '#0D47A1' },
  air:  { bgTop: colors.air,       bgBot: colors.airDark,   textColor: '#880E4F' },
};

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const unlockedAnimals = useProgressStore((s) => s.unlockedAnimals);

  const animal = getAnimalById(id);
  const isUnlocked = !!animal && unlockedAnimals.includes(animal.id);

  const bounceY = useSharedValue(0);
  const emojiScale = useSharedValue(0.5);
  const emojiRotate = useSharedValue('-10deg');

  useEffect(() => {
    // Entrance animation
    emojiScale.value = withSpring(1, { damping: 8, stiffness: 120 });
    emojiRotate.value = withSpring('0deg', { damping: 8 });

    if (isUnlocked) {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-14, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [isUnlocked]);

  const animalStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { scale: emojiScale.value },
      { rotate: emojiRotate.value },
    ],
  }));

  if (!animal) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Hewan" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Hewan tidak ditemukan 😕</Text>
        </View>
      </SafeAreaView>
    );
  }

  const catCfg = CATEGORY_CONFIG[animal.category];
  const displayName = language === 'id' ? animal.nameId : animal.nameEn;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={displayName} bgColor={catCfg.bgTop} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <View style={[styles.hero, { backgroundColor: catCfg.bgTop }]}>
          <Animated.Text style={[styles.animalEmoji, animalStyle]}>
            {isUnlocked ? animal.emoji : '🔒'}
          </Animated.Text>
          <View style={[styles.namePill, { backgroundColor: catCfg.bgBot }]}>
            <Text style={styles.namePillText}>{displayName}</Text>
          </View>
        </View>

        {/* Wave divider */}
        <View style={[styles.wave, { backgroundColor: catCfg.bgTop }]}>
          <View style={[styles.waveBottom, { backgroundColor: colors.bgMain }]} />
        </View>

        {/* Content card */}
        <View style={styles.content}>
          {/* Category tag */}
          <View style={[styles.categoryTag, { backgroundColor: catCfg.bgTop }]}>
            <Text style={[styles.categoryTagText, { color: catCfg.textColor }]}>
              {t(`animals.categories.${animal.category}`)}
            </Text>
          </View>

          {isUnlocked ? (
            <>
              {/* Audio buttons */}
              <Text style={styles.sectionLabel}>Dengarkan</Text>
              <View style={styles.audioRow}>
                <View style={styles.audioItem}>
                  <AudioButton
                    onPress={() => audioManager.playAnimalSound(animal.id)}
                    size={68}
                    variant="primary"
                    accessibilityLabel={`Suara ${animal.nameId}`}
                  />
                  <Text style={styles.audioLabel}>Suara</Text>
                </View>
                <View style={styles.audioItem}>
                  <AudioButton
                    onPress={() => audioManager.playNarration(language, animal.id)}
                    size={68}
                    variant="teal"
                    accessibilityLabel={`Nama ${animal.nameId}`}
                  />
                  <Text style={styles.audioLabel}>Nama</Text>
                </View>
              </View>

              {/* Game shortcuts */}
              <Text style={styles.sectionLabel}>Bermain dengan {animal.nameId}</Text>
              <View style={styles.gameRow}>
                {animal.puzzleAsset && (
                  <TouchableOpacity
                    style={[styles.gameBtn, { backgroundColor: colors.menuPuzzle }]}
                    onPress={() => router.push(`/games/puzzle?animalId=${animal.id}` as any)}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.gameBtnEmoji}>🧩</Text>
                    <Text style={styles.gameBtnLabel}>Puzzle</Text>
                  </TouchableOpacity>
                )}
                {animal.coloringAsset && (
                  <TouchableOpacity
                    style={[styles.gameBtn, { backgroundColor: colors.menuColoring }]}
                    onPress={() => router.push(`/games/coloring?animalId=${animal.id}` as any)}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.gameBtnEmoji}>🎨</Text>
                    <Text style={styles.gameBtnLabel}>Mewarnai</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <View style={styles.lockedBox}>
              <Text style={styles.lockedEmoji}>🔐</Text>
              <Text style={styles.lockedText}>
                {t('animals.locked', { cost: animal.unlockCost })}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgMain },
  scroll: { paddingBottom: spacing.xxl },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontFamily: typography.fontFamily.bold, fontSize: typography.sizes.body, color: colors.textLight },

  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + spacing.md,
  },
  animalEmoji: {
    fontSize: 130,
    marginBottom: spacing.md,
  },
  namePill: {
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  namePillText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.textWhite,
  },
  wave: {
    height: 32,
    marginTop: -1,
  },
  waveBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    borderTopLeftRadius: sizing.borderRadius.xl,
    borderTopRightRadius: sizing.borderRadius.xl,
  },
  content: {
    backgroundColor: colors.bgMain,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  categoryTagText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textLight,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  audioRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xl,
    justifyContent: 'center',
  },
  audioItem: { alignItems: 'center', gap: spacing.sm },
  audioLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.label,
    color: colors.textMedium,
  },
  gameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gameBtn: {
    flex: 1,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.md,
  },
  gameBtnEmoji: { fontSize: 36 },
  gameBtnLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textWhite,
  },
  lockedBox: {
    backgroundColor: colors.lockedBg,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  lockedEmoji: { fontSize: 48 },
  lockedText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.body,
    color: colors.textMedium,
    textAlign: 'center',
  },
});
