import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { shadows } from '../theme/spacing';

interface AudioButtonProps {
  onPress: () => Promise<void> | void;
  size?: number;
  style?: ViewStyle;
  accessibilityLabel?: string;
  variant?: 'primary' | 'teal';
}

export function AudioButton({
  onPress,
  size = 56,
  style,
  accessibilityLabel = 'Putar audio',
  variant = 'primary',
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const outerScale = useSharedValue(1);
  const innerScale = useSharedValue(1);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const ripple1Opacity = useSharedValue(0);
  const ripple2Opacity = useSharedValue(0);

  const bgColor = variant === 'teal' ? colors.secondary : colors.primary;
  const bgColorDark = variant === 'teal' ? colors.secondaryDark : colors.primaryDark;

  const startRipple = () => {
    ripple1.value = 0;
    ripple2.value = 0;
    ripple1Opacity.value = 0.5;
    ripple2Opacity.value = 0.4;

    ripple1.value = withRepeat(withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }), -1, false);
    ripple2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) })
      ),
      -1,
      false
    );
    ripple1Opacity.value = withRepeat(withTiming(0, { duration: 1200 }), -1, false);
    ripple2Opacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 400 }), withTiming(0, { duration: 1200 })),
      -1,
      false
    );
  };

  const stopRipple = () => {
    ripple1.value = 0;
    ripple2.value = 0;
    ripple1Opacity.value = 0;
    ripple2Opacity.value = 0;
  };

  const handlePress = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    innerScale.value = withSequence(withSpring(0.88), withSpring(1));
    outerScale.value = withSpring(1.08, { damping: 8 }, () => {
      outerScale.value = withSpring(1);
    });
    startRipple();
    try {
      await onPress();
    } finally {
      setTimeout(() => {
        setIsPlaying(false);
        stopRipple();
      }, 2200);
    }
  };

  const outerStyle = useAnimatedStyle(() => ({ transform: [{ scale: outerScale.value }] }));
  const innerStyle = useAnimatedStyle(() => ({ transform: [{ scale: innerScale.value }] }));

  const ripple1Style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple1.value * 1.4 }],
    opacity: ripple1Opacity.value,
  }));
  const ripple2Style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple2.value * 1.4 }],
    opacity: ripple2Opacity.value,
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, outerStyle, style]}>
      {/* Ripple rings */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.ripple,
          { borderRadius: size / 2, borderColor: bgColor },
          ripple1Style,
        ]}
      />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.ripple,
          { borderRadius: size / 2, borderColor: bgColor },
          ripple2Style,
        ]}
      />

      {/* Button */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        {/* Shadow layer */}
        <View
          style={[
            styles.shadowLayer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: bgColorDark,
              top: 4,
            },
          ]}
        />
        {/* Top face */}
        <Animated.View
          style={[
            styles.face,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: isPlaying ? colors.secondary : bgColor,
            },
            shadows.md,
            innerStyle,
          ]}
        >
          <Animated.Text style={{ fontSize: size * 0.44 }}>
            {isPlaying ? '🔊' : '🔈'}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    borderWidth: 2,
  },
  shadowLayer: {
    position: 'absolute',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
