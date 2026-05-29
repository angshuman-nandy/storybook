import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

function Dot({ delayMs }: { delayMs: number }) {
  const opacity = useSharedValue(0.18);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.18, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          backgroundColor: Colors.amber,
        },
        style,
      ]}
    />
  );
}

export function LoadingDots() {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Dot delayMs={0} />
      <Dot delayMs={400} />
      <Dot delayMs={800} />
    </View>
  );
}
