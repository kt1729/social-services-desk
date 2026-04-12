import { createContext } from 'react';
import type { Resource, ServiceDocument } from '../../shared/types';

export interface PublicDataContextValue {
  resources: Resource[];
  documents: ServiceDocument[];
  loading: boolean;
  error: string | null;
}

export const PublicDataContext = createContext<PublicDataContextValue | null>(null);
