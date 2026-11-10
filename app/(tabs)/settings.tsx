import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, sizing, shadows } from '../../src/theme/spacing';
import { useAppStore } from '../../src/store/useAppStore';
import { useProgressStore } from '../../src/store/useProgressStore';
import { BigButton } from '../../src/components/BigButton';
import { audioManager } from '../../src/services/AudioManager';
import { animals } from '../../src/data/animals';
import Constants from 'expo-constants';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const musicVolume = useAppStore((s) => s.musicVolume);
  const sfxVolume = useAppStore((s) => s.sfxVolume);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const setMusicVolume = useAppStore((s) => s.setMusicVolume);
  const setSfxVolume = useAppStore((s) => s.setSfxVolume);

  const totalStars = useProgressStore((s) => s.totalStars);
  const unlockedAnimals = useProgressStore((s) => s.unlockedAnimals);
  const activityHistory = useProgressStore((s) => s.activityHistory);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const [resetStep, setResetStep] = useState(0);

  const handleMusicVolume = (v: number) => { setMusicVolume(v); audioManager.setMusicVolume(v); };
  const handleSfxVolume = (v: number) => { setSfxVolume(v); audioManager.setSfxVolume(v); };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderEmoji}>⚙️</Text>
          <Text style={styles.pageHeaderTitle}>{t('settings.title')}</Text>
        </View>

        {/* ── Language ── */}
        <SectionCard icon="🌐" title={t('settings.language')}>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'id' && styles.langBtnActive]}
              onPress={() => setLanguage('id')}
            >
              <Text style={styles.langFlag}>🇮🇩</Text>
              <Text style={[styles.langLabel, language === 'id' && { color: colors.textWhite }]}>
                {t('settings.languageId')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={styles.langFlag}>🇬🇧</Text>
              <Text style={[styles.langLabel, language === 'en' && { color: colors.textWhite }]}>
                {t('settings.languageEn')}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* ── Volume ── */}
        <SectionCard icon="🔊" title="Volume">
          <View style={styles.sliderRow}>
            <Text style={styles.sliderEmoji}>🎵</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={musicVolume}
              onValueChange={handleMusicVolume}
              minimumTrackTintColor={colors.secondary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.secondary}
            />
            <Text style={styles.sliderValue}>{Math.round(musicVolume * 100)}%</Text>
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderEmoji}>🔔</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={sfxVolume}
              onValueChange={handleSfxVolume}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            <Text style={styles.sliderValue}>{Math.round(sfxVolume * 100)}%</Text>
          </View>
        </SectionCard>

        {/* ── Stats ── */}
        <SectionCard icon="📊" title={t('settings.stats')}>
          <View style={styles.statsRow}>
            <StatBox emoji="⭐" value={String(totalStars)} label={t('settings.totalStars')} color={colors.accent} />
            <StatBox emoji="🐾" value={`${unlockedAnimals.length}/${animals.length}`} label={t('settings.totalAnimals')} color={colors.land} />
            <StatBox emoji="🎮" value={String(activityHistory.length)} label={t('settings.totalActivities')} color={colors.sea} />
          </View>
        </SectionCard>

        {/* ── Reset ── */}
        <SectionCard icon="🗑️" title={t('settings.resetProgress')}>
          {resetStep === 0 ? (
            <BigButton
              label={t('settings.resetProgress')}
              onPress={() => setResetStep(1)}
              variant="danger"
              size="md"
            />
          ) : (
            <View style={styles.resetConfirm}>
              <Text style={styles.resetWarn}>{t('settings.resetConfirm')}</Text>
              <Text style={styles.resetWarn2}>{t('settings.resetConfirm2')}</Text>
              <View style={styles.resetBtns}>
                <BigButton label={t('settings.resetNo')} onPress={() => setResetStep(0)} variant="ghost" size="sm" style={{ flex: 1 }} />
                <BigButton label={t('settings.resetYes')} onPress={() => { resetProgress(); setResetStep(0); }} variant="danger" size="sm" style={{ flex: 1 }} />
              </View>
            </View>
          )}
        </SectionCard>

        <Text style={styles.version}>v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.card}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.icon}>{icon}</Text>
        <Text style={sectionStyles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function StatBox({ emoji, value, label, color }: { emoji: string; value: string; label: string; color: string }) {
  return (
    <View style={[statStyles.box, { backgroundColor: color + '30' }]}>
      <Text style={statStyles.emoji}>{emoji}</Text>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  icon: { fontSize: 22 },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
});

const statStyles = StyleSheet.create({
  box: {
    flex: 1,
    borderRadius: sizing.borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  emoji: { fontSize: 24 },
  value: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
  },
  label: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.tiny,
    color: colors.textLight,
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgMain },
  container: { padding: spacing.lg, paddingBottom: spacing.xxl },
  pageHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  pageHeaderEmoji: { fontSize: 44, marginBottom: spacing.xs },
  pageHeaderTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.title,
    color: colors.text,
  },
  langRow: { flexDirection: 'row', gap: spacing.md },
  langBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: sizing.borderRadius.md,
    backgroundColor: colors.bgMain,
    borderWidth: 2,
    borderColor: colors.border,
  },
  langBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  langFlag: { fontSize: 20 },
  langLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textMedium,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  slider: { flex: 1, height: 40 },
  sliderEmoji: { fontSize: 20, width: 28 },
  sliderValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: colors.textMedium,
    width: 36,
    textAlign: 'right',
  },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  resetConfirm: { gap: spacing.sm },
  resetWarn: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body,
    color: colors.error,
    textAlign: 'center',
  },
  resetWarn2: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.small,
    color: colors.textLight,
    textAlign: 'center',
  },
  resetBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  version: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.small,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
