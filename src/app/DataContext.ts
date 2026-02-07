import { createContext } from 'react';
import type { Resource, Guest, ServiceDocument, Feedback, Note, Volunteer } from '../shared/types';

export interface DataContextValue {
  resources: Resource[];
  guests: Guest[];
  documents: ServiceDocument[];
  feedback: Feedback[];
  notes: Note[];
  volunteers: Volunteer[];
  loading: boolean;
  getVolunteerName: (id: string) => string;
}

export const DataContext = createContext<DataContextValue | null>(null);
