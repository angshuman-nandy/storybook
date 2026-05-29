import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Manifest } from '../types';
import { setManifest } from '../store/manifestStore';

// TODO: Replace with your HuggingFace username and Space name
const MANIFEST_URL =
  'https://huggingface.co/spaces/angshuman-nandy/storybook-stories/resolve/main/manifest.json';
const CACHE_KEY = 'manifest_v1';

export interface ManifestState {
  manifest: Manifest | null;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

export function useManifest(): ManifestState {
  const [manifest, setLocal] = useState<Manifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(MANIFEST_URL, {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Manifest = await response.json();
        if (cancelled) return;

        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        setManifest(data);
        setLocal(data);
      } catch (err) {
        if (cancelled) return;

        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const data: Manifest = JSON.parse(cached);
          setManifest(data);
          setLocal(data);
        } else {
          setError(err instanceof Error ? err : new Error('Failed to load'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { manifest, isLoading, error, retry };
}
