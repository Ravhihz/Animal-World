import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, sizing, shadows } from '../../src/theme/spacing';
import { animals } from '../../src/data/animals';
import { badges } from '../../src/data/badges';
import { useProgressStore } from '../../src/store/useProgressStore';
import { AnimalCard } from '../../src/components/AnimalCard';

export default function CollectionScreen() {
  const { t } = useTranslation();
  const unlockedAnimals = useProgressStore((s) => s.unlockedAnimals);
  const earnedBadges = useProgressStore((s) => s.earnedBadges);
  const newlyUnlocked = useProgressStore((s) => s.newlyUnlockedAnimals);

  const unlockedCount = unlockedAnimals.length;
  const totalAnimals = animals.length;
  const progressPct = Math.round((unlockedCount / totalAnimals) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header banner ── */}
        <View style={styles.headerBanner}>
          <Text style={styles.bannerEmoji}>🐾</Text>
          <Text style={styles.bannerTitle}>{t('collection.title')}</Text>
          <Text style={styles.bannerSub}>
            {unlockedCount} {t('collection.of')} {totalAnimals} hewan dikumpulkan
          </Text>

          {/* Progress ring-ish bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progressPct}%` }]} />
            <Text style={styles.progressLabel}>{progressPct}%</Text>
          </View>
        </View>

        {/* ── Animal grid ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🦁 Hewan Kamu</Text>
            <View style={styles.countChip}>
              <Text style={styles.countChipText}>{unlockedCount}/{totalAnimals}</Text>
            </View>
          </View>

          <View style={styles.animalGrid}>
            {animals.map((animal) => {
              const isNew = newlyUnlocked.includes(animal.id);
              return (
                <View key={animal.id} style={styles.cardWrapper}>
                  {isNew && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>NEW!</Text>
                    </View>
                  )}
                  <AnimalCard animal={animal} size={90} showName />
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Trophies ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Trofi</Text>
            <View style={styles.countChip}>
              <Text style={styles.countChipText}>{earnedBadges.length}/{badges.length}</Text>
            </View>
          </View>

          <View style={styles.trophyGrid}>
            {badges.map((badge) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.trophyCard,
                    earned ? styles.trophyCardEarned : styles.trophyCardLocked,
                  ]}
                >
                  <Text style={[styles.trophyEmoji, !earned && styles.trophyEmojiLocked]}>
                    {badge.emoji}
                  </Text>
                  <Text
                    style={[styles.trophyName, !earned && { color: colors.locked }]}
                    numberOfLines={2}
                  >
                    {badge.nameId}
                  </Text>
                  {!earned && (
                    <View style={styles.trophyLock}>
                      <Text style={styles.trophyLockText}>🔒</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgMain },
  container: { paddingBottom: spacing.xxl },

  // ── Header banner ────────────────────────────────────
  headerBanner: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  bannerEmoji: { fontSize: 48, marginBottom: spacing.xs },
  bannerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.title,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  bannerSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.label,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  progressTrack: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: sizing.borderRadius.full,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: sizing.borderRadius.full,
  },
  progressLabel: {
    position: 'absolute',
    right: spacing.sm,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: colors.textWhite,
  },

  // ── Section ───────────────────────────────────────────
  section: {
    backgroundColor: colors.bgCard,
    margin: spacing.md,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.md,
    marginTop: -spacing.lg,
    ...shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.subheading,
    color: colors.text,
  },
  countChip: {
    backgroundColor: colors.bgMain,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  countChipText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: colors.textMedium,
  },

  // ── Animal grid ───────────────────────────────────────
  animalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 0,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  newBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.tiny,
    color: colors.textWhite,
  },

  // ── Trophy grid ───────────────────────────────────────
  trophyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  trophyCard: {
    width: 86,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  trophyCardEarned: {
    backgroundColor: colors.accent,
    ...shadows.sm,
  },
  trophyCardLocked: {
    backgroundColor: colors.lockedBg,
  },
  trophyEmoji: { fontSize: 32 },
  trophyEmojiLocked: { opacity: 0.3 },
  trophyName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.tiny,
    color: colors.text,
    textAlign: 'center',
  },
  trophyLock: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  trophyLockText: { fontSize: 12 },
});
