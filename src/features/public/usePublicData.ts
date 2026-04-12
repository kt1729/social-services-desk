import { useContext } from 'react';
import { PublicDataContext } from './PublicDataContext';

export function usePublicData() {
  const ctx = useContext(PublicDataContext);
  if (!ctx) {
    throw new Error('usePublicData must be used within a PublicDataProvider');
  }
  return ctx;
}
