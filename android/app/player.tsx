import { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, BackHandler } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { WebView } from 'react-native-webview';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/Colors';
import { PixelHeart } from '../src/components/PixelHeart';

type PlayerState = 'loading' | 'ready' | 'error' | 'timeout';

const LOAD_TIMEOUT_MS = 8000;

export default function PlayerScreen() {
  const { url, title } = useLocalSearchParams<{ url: string; title: string }>();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [playerState, setPlayerState] = useState<PlayerState>('loading');
  const overlayOpacity = useSharedValue(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Guard: if no URL after mount, go back — never call router during render
  useEffect(() => {
    if (!url) router.back();
  }, [url]);

  // Load timeout
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setPlayerState((prev) => (prev === 'loading' ? 'timeout' : prev));
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleLoadEnd = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setPlayerState('ready');
    overlayOpacity.value = withTiming(0, {
      duration: 400,
      easing: Easing.inOut(Easing.ease),
    });
  }, [overlayOpacity]);

  const handleError = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setPlayerState('error');
  }, []);

  const handleRetry = useCallback(() => {
    setPlayerState('loading');
    overlayOpacity.value = 1;
    timeoutRef.current = setTimeout(
      () => setPlayerState((prev) => (prev === 'loading' ? 'timeout' : prev)),
      LOAD_TIMEOUT_MS,
    );
    webViewRef.current?.reload();
  }, [overlayOpacity]);

  // Immersive mode — wrapped in try/catch so a missing native module can't crash the screen
  useEffect(() => {
    let restored = false;
    NavigationBar.setVisibilityAsync('hidden').catch(() => {});
    return () => {
      if (!restored) {
        restored = true;
        NavigationBar.setVisibilityAsync('visible').catch(() => {});
      }
    };
  }, []);

  // Hardware back
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      router.back();
      return true;
    });
    return () => sub.remove();
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  // Don't render native WebView until we have a URL
  if (!url) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleError}
      />

      <Animated.View
        style={[
          styles.overlay,
          overlayStyle,
          { pointerEvents: playerState === 'ready' ? 'none' : 'auto' },
        ]}
      >
        {(playerState === 'loading' || playerState === 'timeout') && (
          <View style={styles.centered}>
            <PixelHeart px={16} glow animate />
            {playerState === 'timeout' && (
              <Pressable onPress={handleRetry} hitSlop={24}>
                <Text style={styles.timeoutText}>
                  still loading…{'\n'}tap to retry
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {playerState === 'error' && (
          <View style={styles.centered}>
            <View style={styles.errorIcon}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.errorPixel, i === 3 && styles.errorPixelGap]} />
              ))}
            </View>
            <Text style={styles.errorTitle}>story couldn't load</Text>
            <Pressable onPress={handleRetry} hitSlop={24}>
              <Text style={styles.errorRetry}>tap to retry</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deep,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.deep,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    gap: 24,
  },
  timeoutText: {
    fontFamily: 'VT323_400Regular',
    fontSize: 18,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 18 * 1.5,
  },
  errorIcon: {
    alignItems: 'center',
    gap: 0,
  },
  errorPixel: {
    width: 8,
    height: 8,
    backgroundColor: Colors.coral,
  },
  errorPixelGap: {
    marginTop: 8,
  },
  errorTitle: {
    fontFamily: 'VT323_400Regular',
    fontSize: 19,
    color: Colors.cream,
    textAlign: 'center',
  },
  errorRetry: {
    fontFamily: 'VT323_400Regular',
    fontSize: 16,
    color: Colors.amber,
    textAlign: 'center',
  },
});
