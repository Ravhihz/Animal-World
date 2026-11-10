import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, sizing, shadows } from '../../src/theme/spacing';
import { animals, Animal } from '../../src/data/animals';
import { AnimalCard } from '../../src/components/AnimalCard';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { audioManager } from '../../src/services/AudioManager';
import { useAppStore } from '../../src/store/useAppStore';

type Category = 'all' | 'land' | 'sea' | 'air';

const CATEGORY_CONFIG = [
  { key: 'all' as Category,  emoji: '🌍', color: colors.secondary,    dark: colors.secondaryDark },
  { key: 'land' as Category, emoji: '🌿', color: colors.land,         dark: colors.landDark },
  { key: 'sea' as Category,  emoji: '🌊', color: colors.sea,          dark: colors.seaDark },
  { key: 'air' as Category,  emoji: '🦋', color: colors.air,          dark: colors.airDark },
];

export default function AnimalsScreen() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered = activeCategory === 'all'
    ? animals
    : animals.filter((a) => a.category === activeCategory);

  const activeCfg = CATEGORY_CONFIG.find((c) => c.key === activeCategory)!;

  const handleAnimalPress = async (animal: Animal) => {
    await audioManager.playAnimalSound(animal.id);
    setTimeout(() => audioManager.playNarration(language, animal.id), 1500);
    router.push(`/animals/${animal.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title={t('animals.title')}
        bgColor={colors.bgMain}
      />

      {/* Category pills */}
      <View style={styles.pillsRow}>
        {CATEGORY_CONFIG.map((cfg) => {
          const active = activeCategory === cfg.key;
          return (
            <TouchableOpacity
              key={cfg.key}
              style={[
                styles.pill,
                active && { backgroundColor: cfg.color, ...shadows.sm },
              ]}
              onPress={() => setActiveCategory(cfg.key)}
              activeOpacity={0.85}
            >
              <Text style={styles.pillEmoji}>{cfg.emoji}</Text>
              <Text style={[
                styles.pillLabel,
                { color: active ? colors.textWhite : colors.textLight },
              ]}>
                {t(`animals.categories.${cfg.key}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Count */}
      <Text style={styles.countLabel}>
        {filtered.length} hewan
      </Text>

      {/* Grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onPress={handleAnimalPress}
            size={108}
            showName
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgMain },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: sizing.borderRadius.full,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pillEmoji: { fontSize: 16 },
  pillLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
  },
  countLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.small,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
});
