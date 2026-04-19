/**
 * One-time migration: backfill `active: true` on all resources and documents
 * that were created before the soft-delete feature was added.
 *
 * Usage:
 *   1. Download a service account key from Firebase Console → Project Settings → Service Accounts
 *   2. Save it as `service-account.json` in the project root
 *   3. Run: npx tsx scripts/migrate-active-field.ts
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const serviceAccountPath = resolve(process.cwd(), 'service-account.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8')) as object;

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();
const BATCH_SIZE = 499;

async function migrateCollection(collectionName: string): Promise<number> {
  const snapshot = await db.collection(collectionName).get();
  const docsToUpdate = snapshot.docs.filter((d) => d.data()['active'] === undefined);

  console.log(
    `${collectionName}: ${snapshot.size} total, ${docsToUpdate.length} missing 'active' field`,
  );

  if (docsToUpdate.length === 0) return 0;

  let updated = 0;
  for (let i = 0; i < docsToUpdate.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = docsToUpdate.slice(i, i + BATCH_SIZE);
    for (const d of chunk) {
      batch.update(d.ref, { active: true });
    }
    await batch.commit();
    updated += chunk.length;
    console.log(`  ${collectionName}: committed batch (${updated}/${docsToUpdate.length})`);
  }

  return updated;
}

async function main() {
  console.log('Starting migration…');

  const resourcesUpdated = await migrateCollection('resources');
  const documentsUpdated = await migrateCollection('documents');

  console.log(
    `\nDone. Updated ${resourcesUpdated} resource(s) and ${documentsUpdated} document(s).`,
  );
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
