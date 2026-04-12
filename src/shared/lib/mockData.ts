import { Timestamp } from 'firebase/firestore';
import type { Resource, Guest, ServiceDocument, Volunteer } from '../types';

const now = Timestamp.fromDate(new Date(0));

export const mockVolunteer: Volunteer = {
  id: 'local-volunteer',
  name: 'Local Volunteer',
  email: 'local@example.org',
  role: 'admin',
  createdAt: now,
};

export const mockResources: Resource[] = [
  {
    id: 'res-1',
    name: { en: 'Community Food Pantry' },
    description: { en: 'Weekly groceries and hot meals.' },
    category: 'food',
    address: '123 Main St',
    phone: '555-0100',
    website: 'https://example.org',
    operatingHours: [
      { day: 'mon', open: '09:00', close: '17:00' },
      { day: 'tue', open: '09:00', close: '17:00' },
      { day: 'wed', open: '09:00', close: '17:00' },
      { day: 'thu', open: '09:00', close: '17:00' },
      { day: 'fri', open: '09:00', close: '17:00' },
      { day: 'sat', open: null, close: null },
      { day: 'sun', open: null, close: null },
    ],
    tags: ['food', 'pantry'],
    notes: [],
    feedbackSummary: { upvotes: 0, downvotes: 0 },
    linkedDocuments: ['doc-1'],
    translationStatus: {},
    createdBy: mockVolunteer.id,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockDocuments: ServiceDocument[] = [
  {
    id: 'doc-1',
    title: { en: 'Food Pantry Guide' },
    description: { en: 'How to access pantry services.' },
    type: 'link',
    source: { url: 'https://example.org', storagePath: null, internalContent: null },
    category: 'food',
    tags: ['food'],
    linkedResources: ['res-1'],
    languages: { en: { available: true, storagePath: null } },
    translationStatus: {},
    printSettings: { paperSize: 'letter', orientation: 'portrait', showQRCode: true },
    createdBy: mockVolunteer.id,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockGuests: Guest[] = [
  {
    id: 'guest-1',
    firstName: 'Maria',
    lastInitial: 'G',
    preferredLanguage: 'es',
    needs: ['food'],
    quickNotes: [],
    visitLog: [],
    createdBy: mockVolunteer.id,
    createdAt: now,
    updatedAt: now,
  },
];
