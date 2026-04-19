import { Timestamp } from 'firebase/firestore';

export type LanguageCode = 'en' | 'es' | 'zh' | 'ht';

export type TranslatedField = Partial<Record<LanguageCode, string>>;

export type TranslationStatusValue = 'complete' | 'partial' | 'missing';

export type TranslationStatus = Partial<
  Record<Exclude<LanguageCode, 'en'>, TranslationStatusValue>
>;

export type CategoryKey =
  | 'housing'
  | 'food'
  | 'medical'
  | 'mental_health'
  | 'legal'
  | 'employment'
  | 'financial'
  | 'transportation'
  | 'clothing'
  | 'other';

export interface Tag {
  id: string;
  label: string;
  slug: string;
  createdAt: Timestamp;
}

export type VolunteerRole = 'volunteer' | 'admin';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  role: VolunteerRole;
  createdAt: Timestamp;
}

export interface ResourceNote {
  text: TranslatedField;
  volunteerId: string;
  timestamp: Timestamp;
}

export interface FeedbackSummary {
  upvotes: number;
  downvotes: number;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DaySchedule {
  day: DayOfWeek;
  open: string | null;
  close: string | null;
}

export type OperatingHours = DaySchedule[];

export interface Resource {
  id: string;
  name: TranslatedField;
  description: TranslatedField;
  category: CategoryKey;
  address: string;
  phone: string;
  website: string;
  operatingHours: OperatingHours;
  tags: string[];
  tagIds: string[];
  notes: ResourceNote[];
  feedbackSummary: FeedbackSummary;
  linkedDocuments: string[];
  translationStatus: TranslationStatus;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VisitLogEntry {
  date: Timestamp;
  purpose: string;
  volunteerId: string;
  notes: string;
  resourcesReferred: string[];
  documentsGiven: string[];
}

export interface QuickNote {
  text: string;
  volunteerId: string;
  timestamp: Timestamp;
}

export interface Guest {
  id: string;
  firstName: string;
  lastInitial: string;
  preferredLanguage: LanguageCode;
  needs: CategoryKey[];
  quickNotes: QuickNote[];
  visitLog: VisitLogEntry[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DocumentType = 'pdf' | 'link' | 'internal' | 'image';

export interface DocumentLanguageInfo {
  available: boolean;
  storagePath: string | null;
}

export interface DocumentSource {
  url: string | null;
  storagePath: string | null;
  internalContent: TranslatedField | null;
}

export interface PrintSettings {
  paperSize: 'letter' | 'half' | 'quarter';
  orientation: 'portrait' | 'landscape';
  showQRCode: boolean;
}

export interface ServiceDocument {
  id: string;
  title: TranslatedField;
  description: TranslatedField;
  type: DocumentType;
  source: DocumentSource;
  category: CategoryKey;
  tags: string[];
  tagIds: string[];
  linkedResources: string[];
  languages: Partial<Record<LanguageCode, DocumentLanguageInfo>>;
  translationStatus: TranslationStatus;
  printSettings: PrintSettings;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type FeedbackRating = 'up' | 'down';

export interface Feedback {
  id: string;
  resourceId: string;
  rating: FeedbackRating;
  comment: string;
  volunteerId: string;
  createdAt: Timestamp;
}

export type NoteParentType = 'resource' | 'guest' | 'document' | 'general';

export interface Note {
  id: string;
  parentType: NoteParentType;
  parentId: string | null;
  text: string;
  volunteerId: string;
  createdAt: Timestamp;
}
