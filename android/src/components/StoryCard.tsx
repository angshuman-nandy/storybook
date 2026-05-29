import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { Story } from '../types';

const SPRING_CONFIG = { stiffness: 200, damping: 20 };

function isNew(added: string | undefined): boolean {
  if (!added) return false;
  const addedMs = new Date(added).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - addedMs < sevenDaysMs;
}

interface Props {
  story: Story;
  width: number;
  height: number;
  onPlay: () => void;
}

export function StoryCard({ story, width, height, onPlay }: Props) {
  const btnScale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  function handlePressIn() {
    btnScale.value = withSpring(0.96, SPRING_CONFIG);
  }

  function handlePressOut() {
    btnScale.value = withSpring(1.0, SPRING_CONFIG);
  }

  return (
    <View style={[styles.card, { width, height }]}>
      {/* Thumbnail */}
      <Image
        source={{ uri: story.thumbnail }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
        placeholder={{ color: Colors.night }}
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={[
          'transparent',
          'transparent',
          'rgba(11,11,22,0.88)',
          'rgba(11,11,22,0.97)',
        ]}
        locations={[0, 0.42, 0.82, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* NEW badge */}
      {isNew(story.added) && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      )}

      {/* Bottom content */}
      <View style={styles.bottom}>
        {/* Accent dot + title */}
        <View style={styles.titleRow}>
          <View style={[styles.accentDot, { backgroundColor: story.accent || Colors.coral }]} />
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline} numberOfLines={2}>
          {story.tagline}
        </Text>

        {/* PLAY button */}
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPlay}
        >
          <Animated.View style={[styles.playBtn, btnStyle]}>
            <Text style={styles.playBtnText}>{'▶  PLAY'}</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.night,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.amber,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: Colors.deep,
    letterSpacing: 0.06 * 7,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  accentDot: {
    width: 4,
    height: 4,
    flexShrink: 0,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: Colors.cream,
    lineHeight: 11 * 1.7,
    letterSpacing: 0.04 * 11,
    flex: 1,
  },
  tagline: {
    fontFamily: 'VT323_400Regular',
    fontSize: 19,
    color: Colors.peach,
    paddingLeft: 12,
    marginBottom: 14,
  },
  playBtn: {
    height: 44,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: Colors.deep,
    letterSpacing: 0.06 * 9,
  },
});
