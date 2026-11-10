import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, sizing, shadows } from '../../src/theme/spacing';
import { useProgressStore } from '../../src/store/useProgressStore';
import { useAppStore } from '../../src/store/useAppStore';
import { ParentalGate } from '../../src/components/ParentalGate';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - spacing.lg * 2 - spacing.md) / 2;

// ── Menu Card ─────────────────────────────────────────────────────────────────

interface MenuCardProps {
  emoji: string;
  label: string;
  topColor: string;
  bottomColor: string;
  onPress: () => void;
}

function MenuCard({ emoji, label, topColor, bottomColor, onPress }: MenuCardProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.93, { damping: 18 });
        translateY.value = withSpring(3, { damping: 18 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14 });
        translateY.value = withSpring(0, { damping: 14 });
      }}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Animated.View style={[styles.menuCard, { width: CARD_SIZE }, animStyle]}>
        {/* Card body */}
        <View style={[styles.menuCardBody, { backgroundColor: topColor, height: CARD_SIZE * 0.78 }]}>
          {/* Inner shine */}
          <View style={styles.menuCardShine} />
          <Text style={styles.menuEmoji}>{emoji}</Text>
        </View>
        {/* Card footer */}
        <View style={[styles.menuCardFooter, { backgroundColor: bottomColor }]}>
          <Text style={styles.menuLabel}>{label}</Text>
        </View>
        {/* 3D side shadow */}
        <View style={[styles.menuCardSide, { backgroundColor: bottomColor }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Cloud decoration ──────────────────────────────────────────────────────────
function Cloud({ x, y, scale: s = 1 }: { x: number; y: number; scale?: number }) {
  const drift = useSharedValue(x);
  React.useEffect(() => {
    drift.value = withRepeat(
      withSequence(
        withTiming(x + 12, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(x, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: drift.value }] }));
  return (
    <Animated.Text style={[styles.cloud, { top: y, fontSize: 36 * s }, style]}>☁️</Animated.Text>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { t } = useTranslation();
  const totalStars = useProgressStore((s) => s.totalStars);
  const unlockedAnimals = useProgressStore((s) => s.unlockedAnimals);
  const isParentUnlocked = useAppStore((s) => s.isParentUnlocked);
  const [showParentalGate, setShowParentalGate] = useState(false);

  // Mascot
  const mascotY = useSharedValue(0);
  const mascotRotate = useSharedValue('0deg');
  React.useEffect(() => {
    mascotY.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    mascotRotate.value = withRepeat(
      withSequence(
        withTiming('-8deg', { duration: 1200 }),
        withTiming('8deg', { duration: 1200 }),
        withTiming('0deg', { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: mascotY.value }, { rotate: mascotRotate.value }],
  }));

  const menuItems = [
    { emoji: '🐘', label: t('home.menu.animals'),  top: colors.menuAnimals,  bottom: colors.menuAnimalsDark,  route: '/animals' },
    { emoji: '🎯', label: t('home.menu.matching'),  top: colors.menuMatching, bottom: colors.menuMatchingDark, route: '/games/matching' },
    { emoji: '🧩', label: t('home.menu.puzzle'),    top: colors.menuPuzzle,   bottom: colors.menuPuzzleDark,   route: '/games/puzzle' },
    { emoji: '🎨', label: t('home.menu.coloring'),  top: colors.menuColoring, bottom: colors.menuColoringDark, route: '/games/coloring' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.skyBottom} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Sky hero section ── */}
        <View style={styles.hero}>
          {/* Clouds */}
          <Cloud x={20}  y={12} scale={0.9} />
          <Cloud x={width * 0.55} y={4} scale={1.1} />
          <Cloud x={width * 0.75} y={22} scale={0.75} />

          {/* Top bar: stars + title + settings */}
          <View style={styles.topBar}>
            <View style={styles.starsChip}>
              <Text style={styles.starsText}>⭐ {totalStars}</Text>
            </View>
            <Text style={styles.appTitle}>Animal World</Text>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => isParentUnlocked ? router.push('/(tabs)/settings') : setShowParentalGate(true)}
            >
              <View style={styles.settingsInner}>
                <Text style={styles.settingsIcon}>⚙️</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Mascot */}
          <Animated.Text style={[styles.mascot, mascotStyle]}>🦁</Animated.Text>
          <Text style={styles.welcomeText}>{t('home.welcome')}</Text>
        </View>

        {/* Ground strip */}
        <View style={styles.ground} />

        {/* ── Menu cards ── */}
        <View style={styles.cardsSection}>
          <View style={styles.cardGrid}>
            {menuItems.map((item) => (
              <MenuCard
                key={item.route}
                emoji={item.emoji}
                label={item.label}
                topColor={item.top}
                bottomColor={item.bottom}
                onPress={() => router.push(item.route as any)}
              />
            ))}
          </View>

          {/* Collection banner */}
          <TouchableOpacity
            style={styles.collectionBanner}
            onPress={() => router.push('/(tabs)/collection')}
            activeOpacity={0.88}
          >
            <Text style={styles.collectionBannerEmoji}>🐾</Text>
            <View style={styles.collectionBannerText}>
              <Text style={styles.collectionBannerTitle}>{t('home.menu.collection')}</Text>
              <Text style={styles.collectionBannerSub}>
                {unlockedAnimals.length}/22 hewan dikumpulkan
              </Text>
            </View>
            <View style={styles.collectionArrow}>
              <Text style={styles.collectionArrowText}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ParentalGate
        visible={showParentalGate}
        onSuccess={() => { setShowParentalGate(false); router.push('/(tabs)/settings'); }}
        onCancel={() => setShowParentalGate(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.skyBottom,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },

  // ── Hero ──────────────────────────────────────────────
  hero: {
    backgroundColor: colors.skyBottom,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
    minHeight: 240,
  },
  cloud: {
    position: 'absolute',
    opacity: 0.85,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    zIndex: 10,
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
  appTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
    textAlign: 'center',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgOverlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  settingsIcon: { fontSize: 22 },
  mascot: {
    fontSize: 90,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  welcomeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.subheading,
    color: colors.textMedium,
    textAlign: 'center',
  },

  // ── Ground ────────────────────────────────────────────
  ground: {
    height: 24,
    backgroundColor: '#6BBF59',
    borderTopLeftRadius: sizing.borderRadius.xl,
    borderTopRightRadius: sizing.borderRadius.xl,
    marginTop: -12,
  },

  // ── Cards section ────────────────────────────────────
  cardsSection: {
    backgroundColor: colors.bgMain,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  // ── Menu card ────────────────────────────────────────
  menuCard: {
    borderRadius: sizing.borderRadius.lg,
    overflow: 'visible',
    ...shadows.lg,
  },
  menuCardBody: {
    borderTopLeftRadius: sizing.borderRadius.lg,
    borderTopRightRadius: sizing.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  menuCardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: sizing.borderRadius.lg,
    borderTopRightRadius: sizing.borderRadius.lg,
  },
  menuEmoji: {
    fontSize: 56,
    zIndex: 2,
  },
  menuCardFooter: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomLeftRadius: sizing.borderRadius.lg,
    borderBottomRightRadius: sizing.borderRadius.lg,
  },
  menuLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textWhite,
    letterSpacing: 0.3,
  },
  menuCardSide: {
    position: 'absolute',
    bottom: -4,
    left: 4,
    right: 4,
    height: 8,
    borderBottomLeftRadius: sizing.borderRadius.md,
    borderBottomRightRadius: sizing.borderRadius.md,
    opacity: 0.6,
    zIndex: -1,
  },

  // ── Collection banner ────────────────────────────────
  collectionBanner: {
    backgroundColor: colors.secondary,
    borderRadius: sizing.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.md,
  },
  collectionBannerEmoji: { fontSize: 36 },
  collectionBannerText: { flex: 1 },
  collectionBannerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body,
    color: colors.textWhite,
  },
  collectionBannerSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.small,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  collectionArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionArrowText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.textWhite,
    lineHeight: 30,
  },
});
