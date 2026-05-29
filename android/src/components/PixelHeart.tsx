import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

const GRID = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];

interface Props {
  px?: number;
  color?: string;
  glow?: boolean;
  animate?: boolean;
}

export function PixelHeart({
  px = 8,
  color = Colors.coral,
  glow = false,
  animate = false,
}: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!animate) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 450, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 450, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        glow && {
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: px * 2,
          elevation: 12,
        },
      ]}
    >
      {GRID.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((cell, x) => (
            <View
              key={x}
              style={{
                width: px,
                height: px,
                backgroundColor: cell ? color : 'transparent',
              }}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
