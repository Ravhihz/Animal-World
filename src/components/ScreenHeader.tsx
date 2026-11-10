import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, sizing, shadows } from '../theme/spacing';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  bgColor?: string;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  onBack,
  right,
  bgColor = colors.bgMain,
  style,
}: ScreenHeaderProps) {
  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={[styles.header, { backgroundColor: bgColor }, style]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={handleBack}
        accessibilityLabel="Kembali"
        accessibilityRole="button"
      >
        <View style={styles.backBtnInner}>
          <Text style={styles.backIcon}>‹</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.right}>
        {right ?? <View style={{ width: 44 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  backIcon: {
    fontSize: 28,
    color: colors.text,
    fontFamily: typography.fontFamily.bold,
    lineHeight: 32,
    marginLeft: -2,
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.subheading,
    color: colors.text,
    textAlign: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
});
