import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { audioManager } from '../services/AudioManager';

interface StarRewardProps {
  stars: 1 | 2 | 3;
  size?: number;
  animated?: boolean;
  style?: ViewStyle;
}

function Star({ filled, size, delayMs, animated }: {
  filled: boolean; size: number; delayMs: number; animated: boolean;
}) {
  const scale = useSharedValue(animated ? 0 : 1);
  const rotate = useSharedValue(animated ? '-45deg' : '0deg');
  const glow = useSharedValue(0);

  useEffect(() => {
    if (!animated || !filled) return;

    scale.value = withDelay(delayMs, withSpring(1.25, { damping: 6, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10 });
    }));
    rotate.value = withDelay(delayMs, withSpring('0deg', { damping: 8 }));
    glow.value = withDelay(delayMs, withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.4, { duration: 400 }),
      withTiming(0.8, { duration: 300 }),
      withTiming(0, { duration: 600 })
    ));

    if (filled) {
      setTimeout(() => audioManager.playSfx('star'), delayMs);
    }
  }, [filled, animated, delayMs]);

  const starStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotate.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: 1 + glow.value * 0.6 }],
  }));

  return (
    <View style={{ width: size + 20, height: size + 20, alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow halo */}
      {filled && (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: (size + 20) / 2,
              backgroundColor: 'rgba(255,217,61,0.4)',
            },
            glowStyle,
          ]}
        />
      )}
      <Animated.Text style={[{ fontSize: size, lineHeight: size * 1.2 }, starStyle]}>
        {filled ? '⭐' : '☆'}
      </Animated.Text>
    </View>
  );
}

export function StarReward({ stars, size = 42, animated = true, style }: StarRewardProps) {
  return (
    <View style={[styles.container, style]}>
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          filled={i <= stars}
          size={i === 2 ? size * 1.2 : size}  // middle star bigger
          delayMs={(i - 1) * 350}
          animated={animated}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
