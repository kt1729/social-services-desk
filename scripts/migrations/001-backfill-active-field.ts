import type { Firestore } from 'firebase-admin/firestore';

export const id = '001';
export const name = 'Backfill active:true on resources and documents';

const BATCH_SIZE = 499;

async function migrateCollection(db: Firestore, collectionName: string): Promise<number> {
  const snapshot = await db.collection(collectionName).get();
  const docsToUpdate = snapshot.docs.filter((d) => d.data()['active'] === undefined);

  console.log(
    `  ${collectionName}: ${snapshot.size} total, ${docsToUpdate.length} missing 'active' field`,
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
  }

  return updated;
}

export async function run(db: Firestore): Promise<void> {
  const resources = await migrateCollection(db, 'resources');
  const documents = await migrateCollection(db, 'documents');
  console.log(`  Updated ${resources} resource(s) and ${documents} document(s).`);
}
