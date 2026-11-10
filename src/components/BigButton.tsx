import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { sizing } from '../theme/spacing';

const AnimatedView = Animated.createAnimatedComponent(View);

interface BigButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger' | 'ghost';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = {
  primary:   { top: '#FF8C5A', bottom: '#E04E1A', shadow: '#B83C10', text: colors.textWhite },
  secondary: { top: '#9B7FD4', bottom: '#5B3FA0', shadow: '#3D2880', text: colors.textWhite },
  accent:    { top: '#FFE675', bottom: '#E6B800', shadow: '#B89000', text: colors.text },
  danger:    { top: '#FF6B6B', bottom: '#E03030', shadow: '#B02020', text: colors.textWhite },
  outline:   { top: 'transparent', bottom: 'transparent', shadow: 'transparent', text: colors.primary },
  ghost:     { top: 'rgba(255,107,53,0.1)', bottom: 'rgba(255,107,53,0.1)', shadow: 'transparent', text: colors.primary },
};

const SIZES = {
  sm: { height: 50,  paddingH: 20, fontSize: typography.sizes.label,  depth: 3 },
  md: { height: 62,  paddingH: 28, fontSize: typography.sizes.body,   depth: 4 },
  lg: { height: 76,  paddingH: 36, fontSize: typography.sizes.heading, depth: 5 },
};

export function BigButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
  labelStyle,
  size = 'md',
}: BigButtonProps) {
  const pressed = useSharedValue(false);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const v = VARIANTS[variant];
  const s = SIZES[size];
  const isOutline = variant === 'outline' || variant === 'ghost';

  const topStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = () => {
    translateY.value = withSpring(s.depth, { damping: 20, stiffness: 400 });
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 400 });
    scale.value = withSpring(1, { damping: 20, stiffness: 400 });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[styles.wrapper, style, disabled && styles.disabled]}
    >
      {/* 3D shadow layer — stays in place when top pressed down */}
      {!isOutline && (
        <View
          style={[
            styles.shadowLayer,
            {
              height: s.height,
              paddingHorizontal: s.paddingH,
              backgroundColor: v.shadow,
              borderRadius: sizing.borderRadius.full,
              marginTop: s.depth,
            },
          ]}
        />
      )}

      {/* Top face — moves down on press */}
      <AnimatedView
        style={[
          styles.topFace,
          {
            height: s.height,
            paddingHorizontal: s.paddingH,
            backgroundColor: v.top,
            borderRadius: sizing.borderRadius.full,
            borderWidth: isOutline ? 2.5 : 0,
            borderColor: variant === 'outline' ? colors.primary : 'transparent',
            marginTop: !isOutline ? -s.height : 0,
          },
          topStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={v.text} size="small" />
        ) : (
          <Text style={[styles.label, { color: v.text, fontSize: s.fontSize }, labelStyle]}>
            {icon ? `${icon}  ${label}` : label}
          </Text>
        )}
      </AnimatedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  shadowLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  topFace: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  label: {
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.3,
  },
});
