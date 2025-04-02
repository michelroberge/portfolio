'use client';

import { useGlobalLoading } from '@/lib/useGlobalLoading';

export default function AppInitializer() {
  useGlobalLoading(); // Automatically sets up global fetch & router tracking

  return null;
}
