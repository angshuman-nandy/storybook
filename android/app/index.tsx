import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/constants/Colors';
import { PixelHeart } from '../src/components/PixelHeart';
import { LoadingDots } from '../src/components/LoadingDots';
import { useManifest } from '../src/hooks/useManifest';

export default function SplashScreen() {
  const { manifest, isLoading, error, retry } = useManifest();

  useEffect(() => {
    if (manifest) {
      router.replace('/gallery');
    }
  }, [manifest]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <PixelHeart px={11} glow animate />

      <Text style={styles.title}>pixel stories</Text>

      {error ? (
        <Pressable onPress={retry} hitSlop={24}>
          <Text style={styles.errorText}>couldn't connect.{'\n'}tap to retry.</Text>
        </Pressable>
      ) : (
        <LoadingDots />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.deep,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    color: Colors.cream,
    letterSpacing: 0.08 * 13,
    textAlign: 'center',
    lineHeight: 13 * 1.8,
  },
  errorText: {
    fontFamily: 'VT323_400Regular',
    fontSize: 18,
    color: Colors.cream,
    textAlign: 'center',
    lineHeight: 18 * 1.5,
  },
});
