import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, sizing, shadows } from '../theme/spacing';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

function generateQuestion(): { question: string; answer: number } {
  const type = Math.floor(Math.random() * 2);
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  if (type === 0) return { question: `${a} + ${b} = ?`, answer: a + b };
  const big = Math.max(a, b), small = Math.min(a, b);
  return { question: `${big} − ${small} = ?`, answer: big - small };
}

interface ParentalGateProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ParentalGate({ visible, onSuccess, onCancel }: ParentalGateProps) {
  const { t } = useTranslation();
  const setParentUnlocked = useAppStore((s) => s.setParentUnlocked);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState(generateQuestion);
  const [errorMsg, setErrorMsg] = useState('');

  const shakeX = useSharedValue(0);
  const errorScale = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));
  const errorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: errorScale.value }],
    opacity: errorScale.value,
  }));

  const handleNewQuestion = useCallback(() => {
    setQuestion(generateQuestion());
    setInput('');
  }, []);

  const handleKey = (key: string) => {
    if (key === '⌫') setInput((p) => p.slice(0, -1));
    else if (input.length < 3) setInput((p) => p + key);
  };

  const handleSubmit = () => {
    if (parseInt(input, 10) === question.answer) {
      setParentUnlocked(true);
      setInput('');
      setErrorMsg('');
      onSuccess();
    } else {
      shakeX.value = withSequence(
        withTiming(-14, { duration: 55 }), withTiming(14, { duration: 55 }),
        withTiming(-10, { duration: 55 }), withTiming(10, { duration: 55 }),
        withTiming(0, { duration: 55 })
      );
      errorScale.value = withSpring(1, { damping: 10 });
      setTimeout(() => { errorScale.value = withTiming(0, { duration: 300 }); }, 1800);
      setErrorMsg(t('parentalGate.wrong'));
      setInput('');
      handleNewQuestion();
    }
  };

  const numpadKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['⌫', '0', '✓'],
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, shakeStyle]}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.lockEmoji}>🔐</Text>
            <Text style={styles.title}>{t('parentalGate.title')}</Text>
            <Text style={styles.subtitle}>{t('parentalGate.instruction')}</Text>
          </View>

          {/* Question */}
          <View style={styles.questionBox}>
            <Text style={styles.question}>{question.question}</Text>
          </View>

          {/* Answer display */}
          <View style={styles.answerRow}>
            <View style={[styles.answerBox, input && { borderColor: colors.primary }]}>
              <Text style={styles.answerText}>{input || '_'}</Text>
            </View>
          </View>

          {/* Error */}
          {!!errorMsg && (
            <Animated.View style={[styles.errorPill, errorStyle]}>
              <Text style={styles.errorText}>❌ {errorMsg}</Text>
            </Animated.View>
          )}

          {/* Numpad */}
          <View style={styles.numpad}>
            {numpadKeys.map((row, ri) => (
              <View key={ri} style={styles.numpadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.numpadKey,
                      key === '✓' && styles.numpadConfirm,
                      key === '⌫' && styles.numpadDelete,
                    ]}
                    onPress={() => key === '✓' ? handleSubmit() : handleKey(key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.numpadText,
                      key === '✓' && styles.numpadConfirmText,
                    ]}>
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Cancel */}
          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.bgOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: sizing.borderRadius.xl,
    width: width * 0.88,
    overflow: 'hidden',
    ...shadows.xl,
  },
  cardHeader: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  lockEmoji: { fontSize: 36, marginBottom: spacing.xs },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.textWhite,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.label,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  questionBox: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: colors.bgMain,
    borderRadius: sizing.borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  question: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 30,
    color: colors.text,
  },
  answerRow: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  answerBox: {
    width: 90,
    height: 54,
    borderRadius: sizing.borderRadius.md,
    borderWidth: 2.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgMain,
  },
  answerText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
  },
  errorPill: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.errorLight,
    borderRadius: sizing.borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  errorText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.small,
    color: colors.error,
  },
  numpad: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  numpadKey: {
    flex: 1,
    height: 64,
    backgroundColor: colors.bgMain,
    borderRadius: sizing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  numpadConfirm: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  numpadDelete: {
    backgroundColor: colors.bgMain,
    borderColor: colors.borderStrong,
  },
  numpadText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.heading,
    color: colors.text,
  },
  numpadConfirmText: {
    color: colors.textWhite,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cancelText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.sizes.label,
    color: colors.textLight,
  },
});
