import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing, sizing, shadows } from '../../../src/theme/spacing';
import { animals } from '../../../src/data/animals';
import { puzzleLevels } from '../../../src/data/levels';
import { PuzzleBoard } from '../../../src/modules/puzzle/PuzzleBoard';
import { CelebrationOverlay } from '../../../src/components/CelebrationOverlay';
import { RewardService } from '../../../src/services/RewardService';
import { Badge } from '../../../src/data/badges';
import { ScreenHeader } from '../../../src/components/ScreenHeader';

type Screen = 'level_select' | 'game';

export default function PuzzleScreen() {
  const { t } = useTranslation();

  // Terima animalId dari URL param (dari detail hewan atau home)
  const { animalId: paramAnimalId } = useLocalSearchParams<{ animalId?: string }>();

  // Fallback ke hewan pertama yang unlock jika tidak ada param
  const defaultAnimal = animals.find((a) => a.isDefaultUnlocked) ?? animals[0];
  const animal = animals.find((a) => a.id === paramAnimalId) ?? defaultAnimal;

  const [screen, setScreen] = useState<Screen>('level_select');
  const [pieces, setPieces] = useState<4 | 6>(4);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rewardStars, setRewardStars] = useState<1 | 2 | 3>(1);
  const [rewardBadges, setRewardBadges] = useState<Badge[]>([]);
  const [rewardAnimals, setRewardAnimals] = useState<string[]>([]);

  const handleGameComplete = async (hintsUsed: number) => {
    const result = await RewardService.processActivityCompletion(
      'puzzle',
      { hintsUsed },
      animal.id
    );
    setRewardStars(result.stars);
    setRewardBadges(result.newBadges);
    setRewardAnimals(result.newAnimals);
    setShowCelebration(true);
  };

  const handleContinue = () => {
    setShowCelebration(false);
    router.back();
  };

  const handlePlayAgain = () => {
    setShowCelebration(false);
    setScreen('level_select');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={`🧩 ${animal.nameId}`}
        onBack={() => screen === 'game' ? setScreen('level_select') : router.back()}
      />

      {screen === 'level_select' ? (
        /* ── LEVEL SELECT ─────────────────────────────────── */
        <View style={styles.levelContainer}>
          {/* Preview hewan */}
          <Text style={styles.animalPreview}>{animal.emoji}</Text>
          <Text style={styles.animalName}>{animal.nameId}</Text>
          <Text style={styles.prompt}>Pilih tingkat kesulitan:</Text>

          {puzzleLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={styles.levelBtn}
              onPress={() => {
                setPieces(level.pieces);
                setScreen('game');
              }}
              activeOpacity={0.85}
            >
              {/* Visual grid preview */}
              <View style={styles.gridPreview}>
                {Array.from({ length: level.pieces }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.gridPreviewCell,
                      {
                        width: level.pieces === 4 ? 20 : 16,
                        height: level.pieces === 4 ? 20 : 16,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.levelInfo}>
                <Text style={styles.levelName}>
                  {level.pieces === 4 ? '😊 Mudah' : '😎 Sulit'}
                </Text>
                <Text style={styles.levelDetail}>
                  {level.gridRows} × {level.gridCols} = {level.pieces} potongan
                </Text>
              </View>

              <Text style={styles.levelArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        /* ── GAME ─────────────────────────────────────────── */
        <PuzzleBoard
          key={`${animal.id}-${pieces}`}
          totalPieces={pieces}
          animalEmoji={animal.emoji}
          animalName={animal.nameId}
          onComplete={handleGameComplete}
        />
      )}

      <CelebrationOverlay
        visible={showCelebration}
        stars={rewardStars}
        title={t('puzzle.complete')}
        newBadges={rewardBadges}
        newAnimals={rewardAnimals}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  levelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  animalPreview: {
    fontSize: 96,
    marginBottom: spacing.xs,
  },
  animalName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  prompt: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.body,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  levelBtn: {
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.md,
  },
  gridPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 48,
    gap: 3,
  },
  gridPreviewCell: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    opacity: 0.7,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.subheading,
    color: colors.text,
  },
  levelDetail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.label,
    color: colors.textLight,
    marginTop: 2,
  },
  levelArrow: {
    fontSize: 28,
    color: colors.textLight,
    fontFamily: typography.fontFamily.bold,
  },
});
