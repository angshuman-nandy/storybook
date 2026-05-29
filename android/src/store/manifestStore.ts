import { Manifest } from '../types';

// Module-level store: persists for the app session.
// Splash sets it once; Gallery and Player read from it.
let _manifest: Manifest | null = null;

export function setManifest(m: Manifest): void {
  _manifest = m;
}

export function getManifest(): Manifest | null {
  return _manifest;
}
