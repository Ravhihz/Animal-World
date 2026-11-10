import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, sizing, shadows } from '../../theme/spacing';
import { usePuzzleLogic, PuzzlePiece } from './usePuzzleLogic';
import { audioManager } from '../../services/AudioManager';

const { width } = Dimensions.get('window');
const BOARD_PADDING = spacing.lg * 2;
const BOARD_WIDTH = width - BOARD_PADDING;

// ── Piece visual (crop emoji) ─────────────────────────────────────────────────

function PieceVisual({
  piece,
  animalEmoji,
  pieceSize,
  cols,
  rows,
  isFilled = false,
}: {
  piece: PuzzlePiece;
  animalEmoji: string;
  pieceSize: number;
  cols: number;
  rows: number;
  isFilled?: boolean;
}) {
  const emojiSize = pieceSize * Math.max(cols, rows) * 0.85;
  const offsetX = -(piece.col * pieceSize) + (pieceSize - emojiSize) / 2;
  const offsetY = -(piece.row * pieceSize) + (pieceSize - emojiSize) / 2;

  return (
    <View
      style={[
        styles.pieceContainer,
        {
          width: pieceSize,
          height: pieceSize,
          borderColor: isFilled ? colors.success : colors.border,
          borderWidth: isFilled ? 2 : 1.5,
          backgroundColor: isFilled ? '#E8FFF5' : colors.bgCard,
        },
      ]}
    >
      <View style={{ width: pieceSize, height: pieceSize, overflow: 'hidden' }}>
        <Text
          style={{
            fontSize: emojiSize,
            position: 'absolute',
            left: offsetX,
            top: offsetY,
            lineHeight: emojiSize,
          }}
        >
          {animalEmoji}
        </Text>
      </View>
      {!isFilled && (
        <View style={styles.pieceNumBadge}>
          <Text style={styles.pieceNum}>{piece.id + 1}</Text>
        </View>
      )}
      {isFilled && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </View>
  );
}

// ── Tappable Piece (di tray) ──────────────────────────────────────────────────

function TrayPiece({
  piece,
  animalEmoji,
  pieceSize,
  cols,
  rows,
  isSelected,
  onPress,
}: {
  piece: PuzzlePiece;
  animalEmoji: string;
  pieceSize: number;
  cols: number;
  rows: number;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.88), withSpring(1));
    onPress();
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityLabel={`Potongan ${piece.id + 1}`}
      >
        <View
          style={[
            styles.pieceContainer,
            {
              width: pieceSize,
              height: pieceSize,
              borderColor: isSelected ? colors.primary : colors.border,
              borderWidth: isSelected ? 3 : 1.5,
              backgroundColor: isSelected ? `${colors.primary}15` : colors.bgCard,
            },
            isSelected && shadows.md,
          ]}
        >
          <View style={{ width: pieceSize, height: pieceSize, overflow: 'hidden' }}>
            <Text
              style={{
                fontSize: pieceSize * Math.max(cols, rows) * 0.85,
                position: 'absolute',
                left: -(piece.col * pieceSize) + (pieceSize - pieceSize * Math.max(cols, rows) * 0.85) / 2,
                top: -(piece.row * pieceSize) + (pieceSize - pieceSize * Math.max(cols, rows) * 0.85) / 2,
                lineHeight: pieceSize * Math.max(cols, rows) * 0.85,
              }}
            >
              {animalEmoji}
            </Text>
          </View>
          <View style={styles.pieceNumBadge}>
            <Text style={styles.pieceNum}>{piece.id + 1}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── PuzzleBoard ───────────────────────────────────────────────────────────────

interface PuzzleBoardProps {
  totalPieces: 4 | 6;
  animalEmoji: string;
  animalName: string;
  onComplete: (hintsUsed: number) => void;
}

export function PuzzleBoard({
  totalPieces,
  animalEmoji,
  animalName,
  onComplete,
}: PuzzleBoardProps) {
  const {
    trayPieces,
    filledSlots,
    selectedPiece,
    hintsUsed,
    showHint,
    isComplete,
    cols,
    rows,
    selectPiece,
    tryPlaceInSlot,
    useHint,
  } = usePuzzleLogic(totalPieces);

  const pieceSize = Math.floor((BOARD_WIDTH - spacing.sm * (cols - 1)) / cols);
  const trayPieceSize = Math.min(Math.floor(pieceSize * 0.82), 88);

  useEffect(() => {
    if (isComplete) {
      audioManager.playSfx('celebrate');
      setTimeout(() => onComplete(hintsUsed), 500);
    }
  }, [isComplete]);

  const handleSlotPress = (slotIndex: number) => {
    if (!selectedPiece) return;
    if (filledSlots.has(slotIndex)) return;
    const correct = tryPlaceInSlot(slotIndex);
    if (correct) {
      audioManager.playSfx('correct');
    } else {
      audioManager.playSfx('wrong');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Instruksi */}
      <Text style={styles.instruction}>
        {selectedPiece
          ? `Potongan ${selectedPiece.id + 1} dipilih — tap slot nomor yang sesuai!`
          : 'Tap potongan di bawah, lalu tap slot yang sesuai ↑'}
      </Text>

      {/* ── BOARD ─────────────────────────────────── */}
      <View style={styles.boardWrapper}>
        {Array.from({ length: rows }).map((_, row) => (
          <View key={row} style={styles.boardRow}>
            {Array.from({ length: cols }).map((_, col) => {
              const slotIndex = row * cols + col;
              const filled = filledSlots.get(slotIndex);
              const isTarget = !!selectedPiece && !filledSlots.has(slotIndex);

              return filled ? (
                <PieceVisual
                  key={slotIndex}
                  piece={filled}
                  animalEmoji={animalEmoji}
                  pieceSize={pieceSize}
                  cols={cols}
                  rows={rows}
                  isFilled
                />
              ) : (
                <TouchableOpacity
                  key={slotIndex}
                  style={[
                    styles.emptySlot,
                    {
                      width: pieceSize,
                      height: pieceSize,
                      borderColor: isTarget ? colors.primary : colors.border,
                      backgroundColor: isTarget ? `${colors.primary}10` : colors.bgMain,
                    },
                  ]}
                  onPress={() => handleSlotPress(slotIndex)}
                  disabled={!selectedPiece}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.slotNumber,
                      { color: isTarget ? colors.primary : colors.border },
                    ]}
                  >
                    {slotIndex + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* ── HINT BUTTON ─────────────────────────── */}
      <TouchableOpacity style={styles.hintBtn} onPress={useHint}>
        <Text style={styles.hintText}>
          👁️ Lihat Petunjuk {hintsUsed > 0 ? `(${hintsUsed}×)` : ''}
        </Text>
      </TouchableOpacity>

      {/* ── TRAY ─────────────────────────────────── */}
      <View style={styles.tray}>
        {trayPieces.length === 0 ? (
          <Text style={styles.trayEmpty}>🎉 Semua terpasang!</Text>
        ) : (
          <View style={styles.trayGrid}>
            {trayPieces.map((piece) => (
              <TrayPiece
                key={piece.id}
                piece={piece}
                animalEmoji={animalEmoji}
                pieceSize={trayPieceSize}
                cols={cols}
                rows={rows}
                isSelected={selectedPiece?.id === piece.id}
                onPress={() => selectPiece(piece)}
              />
            ))}
          </View>
        )}
      </View>

      {/* ── HINT MODAL ─────────────────────────── */}
      <Modal visible={showHint} transparent animationType="fade">
        <View style={styles.hintBackdrop}>
          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>Gambar Utuh</Text>
            <Text style={styles.hintAnimal}>{animalEmoji}</Text>
            <Text style={styles.hintName}>{animalName}</Text>
            <View style={styles.hintGrid}>
              {Array.from({ length: rows }).map((_, row) => (
                <View key={row} style={styles.hintRow}>
                  {Array.from({ length: cols }).map((_, col) => (
                    <View key={col} style={styles.hintCell}>
                      <Text style={styles.hintCellNum}>{row * cols + col + 1}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <Text style={styles.hintClose}>Menutup otomatis...</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  instruction: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.small,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  boardWrapper: {
    gap: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  boardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pieceContainer: {
    borderRadius: sizing.borderRadius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieceNumBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 4,
    paddingHorizontal: 3,
  },
  pieceNum: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
  },
  checkText: {
    fontSize: 13,
    color: colors.success,
    fontFamily: typography.fontFamily.bold,
  },
  emptySlot: {
    borderRadius: sizing.borderRadius.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 22,
  },
  hintBtn: {
    backgroundColor: colors.secondary,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  hintText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.label,
    color: colors.textWhite,
  },
  tray: {
    width: '100%',
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.md,
    minHeight: 110,
    ...shadows.sm,
  },
  trayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  trayEmpty: {
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body,
    color: colors.success,
    paddingVertical: spacing.md,
  },
  hintBackdrop: {
    flex: 1,
    backgroundColor: colors.bgOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintCard: {
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 260,
    ...shadows.xl,
  },
  hintTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  hintAnimal: {
    fontSize: 80,
    marginBottom: spacing.sm,
  },
  hintName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  hintGrid: {
    gap: 3,
    marginBottom: spacing.md,
  },
  hintRow: {
    flexDirection: 'row',
    gap: 3,
  },
  hintCell: {
    width: 48,
    height: 48,
    backgroundColor: colors.bgMain,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintCellNum: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.textLight,
  },
  hintClose: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.label,
    color: colors.textLight,
  },
});
