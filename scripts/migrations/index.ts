import type { Firestore } from 'firebase-admin/firestore';
import * as m001 from './001-backfill-active-field';

export interface Migration {
  id: string;
  name: string;
  run: (db: Firestore) => Promise<void>;
}

export const migrations: Migration[] = [m001];
