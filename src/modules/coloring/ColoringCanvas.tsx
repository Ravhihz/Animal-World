import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors as themeColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, sizing, shadows } from '../../theme/spacing';
import { getSvgAnimal } from '../../data/svgAnimals';
import { audioManager } from '../../services/AudioManager';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 56 * 2 - spacing.sm * 2; // minus kiri & kanan col

const PALETTE_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759',
  '#00C7BE', '#007AFF', '#5856D6', '#FF2D55',
  '#8E8E93', '#A2845E', '#FFFFFF', '#1A1A2E',
];

// ── Color Swatch ──────────────────────────────────────────────────────────────

function Swatch({
  color, isSelected, onPress,
}: { color: string; isSelected: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ marginVertical: 3 }, animStyle]}>
      <TouchableOpacity
        onPress={() => {
          scale.value = withSequence(withSpring(1.3, { damping: 8 }), withSpring(1));
          onPress();
        }}
        activeOpacity={0.85}
      >
        <View style={[
          styles.swatch,
          { backgroundColor: color },
          isSelected && styles.swatchSelected,
          color === '#FFFFFF' && styles.swatchWhite,
        ]}>
          {isSelected && <Text style={styles.swatchCheck}>✓</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Pencil indicator ──────────────────────────────────────────────────────────

function PencilIndicator({ color }: { color: string }) {
  return (
    <View style={styles.pencilWrapper}>
      <View style={styles.pencilBody}>
        <View style={[styles.pencilEraser]} />
        <View style={[styles.pencilShaft, { backgroundColor: color }]} />
        <View style={styles.pencilTipWrapper}>
          <View style={[styles.pencilTip, { borderTopColor: color }]} />
          <View style={styles.pencilLead} />
        </View>
      </View>
    </View>
  );
}

// ── SVG Canvas ────────────────────────────────────────────────────────────────

function SvgCanvas({
  animalId, colorMap, onRegionPress, width: canvasWidth,
}: {
  animalId: string;
  colorMap: Map<string, string>;
  onRegionPress: (regionId: string) => void;
  width: number;
}) {
  const svgData = getSvgAnimal(animalId);
  const vbParts = svgData.viewBox.split(' ').map(Number);
  const vbWidth = vbParts[2] || 200;
  const vbHeight = vbParts[3] || 200;
  const aspectRatio = vbHeight / vbWidth;
  const canvasHeight = canvasWidth * aspectRatio;

  const sortedRegions = [...svgData.regions].sort(
    (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)
  );

  return (
    <Svg width={canvasWidth} height={canvasHeight} viewBox={svgData.viewBox}>
      <Path
        d={`M0 0 L${vbWidth} 0 L${vbWidth} ${vbHeight} L0 ${vbHeight} Z`}
        fill="#FFFFFF"
      />
      {sortedRegions.map((region) => {
        const filled = colorMap.get(region.id);
        const isTransparent = region.defaultColor === 'transparent' || region.defaultColor === 'rgba(0,0,0,0)';
        return (
          <Path
            key={region.id}
            d={region.path}
            fill={filled ?? (isTransparent ? 'none' : region.defaultColor)}
            stroke={region.strokeColor}
            strokeWidth={region.strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            onPress={() => !isTransparent && onRegionPress(region.id)}
          />
        );
      })}
    </Svg>
  );
}

// ── Main ColoringCanvas ───────────────────────────────────────────────────────

interface ColoringCanvasProps {
  animalId: string;
  animalEmoji: string;
  animalName?: string;
  onComplete: (coloredPercent: number) => void;
}

export function ColoringCanvas({
  animalId, animalEmoji, animalName, onComplete,
}: ColoringCanvasProps) {
  const svgData = getSvgAnimal(animalId);
  // Hanya hitung region yang bisa diwarnai (bukan transparent)
  const colorableRegions = svgData.regions.filter(
    (r) => r.defaultColor !== 'transparent' && r.defaultColor !== 'rgba(0,0,0,0)'
  );
  const totalRegions = colorableRegions.length;

  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);
  const [colorMap, setColorMap] = useState<Map<string, string>>(new Map());
  const [history, setHistory] = useState<Map<string, string>[]>([]);
  const [lastColoredId, setLastColoredId] = useState<string | null>(null);

  const flashScale = useSharedValue(1);
  const canUndo = history.length > 0;
  const coloredCount = [...colorMap.values()].filter(Boolean).length;
  const coloredPercent = totalRegions > 0
    ? Math.round((coloredCount / totalRegions) * 100)
    : 0;

  const handleRegionPress = useCallback((regionId: string) => {
    setHistory((prev) => [...prev, new Map(colorMap)]);
    setColorMap((prev) => {
      const next = new Map(prev);
      next.set(regionId, selectedColor);
      return next;
    });
    setLastColoredId(regionId);
    flashScale.value = withSequence(
      withSpring(1.04, { damping: 8 }),
      withSpring(1, { damping: 12 })
    );
    audioManager.playSfx('correct');
  }, [colorMap, selectedColor]);

  const handleUndo = () => {
    if (!canUndo) return;
    setColorMap(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setLastColoredId(null);
  };

  const handleReset = () => {
    setHistory((prev) => [...prev, new Map(colorMap)]);
    setColorMap(new Map());
    setLastColoredId(null);
  };

  const canvasAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flashScale.value }],
  }));

  const activeRegion = svgData.regions.find((r) => r.id === lastColoredId);

  return (
    <View style={styles.root}>
      <View style={styles.mainRow}>

        {/* ── Kiri: pensil + undo/reset ── */}
        <View style={styles.leftCol}>
          <PencilIndicator color={selectedColor} />
          <View style={styles.leftBtns}>
            <TouchableOpacity
              style={[styles.iconBtn, !canUndo && styles.iconBtnDisabled]}
              onPress={handleUndo}
              disabled={!canUndo}
            >
              <Text style={styles.iconBtnText}>↩</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleReset}>
              <Text style={styles.iconBtnText}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Tengah: Canvas ── */}
        <View style={styles.centerCol}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${coloredPercent}%` }]} />
          </View>

          <Animated.View style={[styles.canvasWrapper, canvasAnimStyle]}>
            <SvgCanvas
              animalId={animalId}
              colorMap={colorMap}
              onRegionPress={handleRegionPress}
              width={CANVAS_WIDTH}
            />
          </Animated.View>

          {/* Label area aktif */}
          <View style={styles.labelRow}>
            {activeRegion ? (
              <View style={[
                styles.activeLabelPill,
                { backgroundColor: colorMap.get(activeRegion.id) ?? themeColors.primary },
              ]}>
                <Text style={styles.activeLabelText}>✓ {activeRegion.label}</Text>
              </View>
            ) : (
              <Text style={styles.hint}>
                Pilih warna → tap bagian gambar
              </Text>
            )}
          </View>
        </View>

        {/* ── Kanan: palette warna vertikal ── */}
        <ScrollView
          style={styles.rightCol}
          contentContainerStyle={styles.paletteList}
          showsVerticalScrollIndicator={false}
        >
          {PALETTE_COLORS.map((color) => (
            <Swatch
              key={color}
              color={color}
              isSelected={selectedColor === color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Bottom bar ── */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomProgress}>
          {coloredCount}/{totalRegions} area · {coloredPercent}%
        </Text>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => {
            if (coloredPercent >= 70) audioManager.playSfx('celebrate');
            onComplete(coloredPercent);
          }}
        >
          <Text style={styles.doneBtnText}>
            {coloredPercent >= 100 ? '🎉 Selesai!' : '✅ Selesai'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: themeColors.bgMain,
  },
  mainRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },

  // ── Kiri ────────────────────────────────────────────
  leftCol: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: spacing.md,
  },
  pencilWrapper: {
    alignItems: 'center',
  },
  pencilBody: {
    alignItems: 'center',
  },
  pencilEraser: {
    width: 18,
    height: 10,
    backgroundColor: '#FFB3BA',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 1,
    borderColor: '#555',
  },
  pencilShaft: {
    width: 18,
    height: 52,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#555',
  },
  pencilTipWrapper: {
    alignItems: 'center',
  },
  pencilTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  pencilLead: {
    width: 4,
    height: 5,
    backgroundColor: '#333',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    marginTop: -1,
  },
  leftBtns: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: themeColors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  iconBtnDisabled: { opacity: 0.3 },
  iconBtnText: { fontSize: 18 },

  // ── Tengah ───────────────────────────────────────────
  centerCol: {
    flex: 1,
    alignItems: 'center',
  },
  progressBar: {
    width: '95%',
    height: 6,
    backgroundColor: themeColors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: themeColors.primary,
    borderRadius: 3,
  },
  canvasWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: sizing.borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  labelRow: {
    marginTop: spacing.sm,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLabelPill: {
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  activeLabelText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.small,
    color: themeColors.textWhite,
  },
  hint: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.small,
    color: themeColors.textLight,
    textAlign: 'center',
  },

  // ── Kanan ────────────────────────────────────────────
  rightCol: {
    width: 52,
    maxHeight: SCREEN_HEIGHT * 0.65,
  },
  paletteList: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  swatchSelected: {
    borderColor: '#1A1A2E',
    transform: [{ scale: 1.15 }],
  },
  swatchWhite: {
    borderColor: themeColors.border,
  },
  swatchCheck: {
    fontSize: 15,
    color: '#1A1A2E',
    fontFamily: typography.fontFamily.bold,
  },

  // ── Bottom bar ───────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: themeColors.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  bottomProgress: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.label,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  doneBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  doneBtnText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body,
    color: '#FFFFFF',
  },
});
