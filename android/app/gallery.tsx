import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  StatusBar as RNStatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { StoryCard } from '../src/components/StoryCard';
import { getManifest } from '../src/store/manifestStore';
import { Story } from '../src/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = RNStatusBar.currentHeight ?? 24;
const SIDE_MARGIN = 16;
const CARD_GAP = 12;
const PEEK = 16;
const CARD_WIDTH = SCREEN_WIDTH - SIDE_MARGIN - CARD_GAP - PEEK;
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - STATUS_BAR_HEIGHT;
const CARD_HEIGHT = Math.round(AVAILABLE_HEIGHT * 0.83);
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

function AnimatedCard({
  story,
  index,
  scrollX,
  onPlay,
}: {
  story: Story;
  index: number;
  scrollX: Animated.SharedValue<number>;
  onPlay: () => void;
}) {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.96, 1.0, 0.96],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[{ marginLeft: index === 0 ? SIDE_MARGIN : CARD_GAP }, animStyle]}>
      <StoryCard story={story} width={CARD_WIDTH} height={CARD_HEIGHT} onPlay={onPlay} />
    </Animated.View>
  );
}

function PaginationDot({
  index,
  scrollX,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];
    const isActive = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor: isActive > 0.5 ? Colors.amber : 'rgba(253,240,213,0.2)',
    };
  });

  return <Animated.View style={[styles.dot, style]} />;
}

export default function GalleryScreen() {
  const manifest = getManifest();
  const stories = manifest?.stories ?? [];
  const scrollX = useSharedValue(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollX.value = e.nativeEvent.contentOffset.x;
  }

  function handlePlay(story: Story) {
    router.push({
      pathname: '/player',
      params: { url: story.url, title: story.title },
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        contentContainerStyle={{ paddingRight: SIDE_MARGIN }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.list}
        renderItem={({ item, index }) => (
          <AnimatedCard
            story={item}
            index={index}
            scrollX={scrollX}
            onPlay={() => handlePlay(item)}
          />
        )}
      />

      {stories.length > 1 && (
        <View style={styles.pagination}>
          {stories.map((_, index) => (
            <PaginationDot key={index} index={index} scrollX={scrollX} />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deep,
    alignItems: 'center',
  },
  list: {
    flexGrow: 0,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
  },
});
