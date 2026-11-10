import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../src/theme/colors';
import { animals } from '../../../src/data/animals';
import { ColoringCanvas } from '../../../src/modules/coloring/ColoringCanvas';
import { CelebrationOverlay } from '../../../src/components/CelebrationOverlay';
import { RewardService } from '../../../src/services/RewardService';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { Badge } from '../../../src/data/badges';

export default function ColoringScreen() {
  const { t } = useTranslation();
  const { animalId: paramAnimalId } = useLocalSearchParams<{ animalId?: string }>();

  const defaultAnimal = animals.find((a) => a.isDefaultUnlocked) ?? animals[0];
  const animal = animals.find((a) => a.id === paramAnimalId) ?? defaultAnimal;

  const [showCelebration, setShowCelebration] = useState(false);
  const [rewardStars, setRewardStars] = useState<1 | 2 | 3>(1);
  const [rewardBadges, setRewardBadges] = useState<Badge[]>([]);
  const [rewardAnimals, setRewardAnimals] = useState<string[]>([]);

  const handleGameComplete = async (coloredPercent: number) => {
    const result = await RewardService.processActivityCompletion(
      'coloring',
      { coloredPercent },
      animal.id
    );
    setRewardStars(result.stars);
    setRewardBadges(result.newBadges);
    setRewardAnimals(result.newAnimals);
    setShowCelebration(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={`🎨 ${t('coloring.title')} ${animal.nameId}`}
        onBack={() => router.back()}
      />

      <ColoringCanvas
        key={animal.id}
        animalId={animal.id}
        animalEmoji={animal.emoji}
        animalName={animal.nameId}
        onComplete={handleGameComplete}
      />

      <CelebrationOverlay
        visible={showCelebration}
        stars={rewardStars}
        title={t('coloring.complete')}
        newBadges={rewardBadges}
        newAnimals={rewardAnimals}
        onContinue={() => { setShowCelebration(false); router.back(); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
});
