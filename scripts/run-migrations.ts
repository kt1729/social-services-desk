/**
 * Migration runner — applies pending numbered migrations to Firestore.
 *
 * Usage:
 *   Set FIREBASE_SERVICE_ACCOUNT env var to the service account JSON string, then:
 *   npx tsx scripts/run-migrations.ts
 *
 *   Locally: set FIREBASE_SERVICE_ACCOUNT in .env, then run:
 *     node --env-file=.env node_modules/.bin/tsx scripts/run-migrations.ts
 *   CI: store as a GitHub Actions secret named FIREBASE_SERVICE_ACCOUNT
 *
 * Each migration is tracked in the Firestore `_migrations` collection.
 * Already-applied migrations are skipped automatically (safe to re-run).
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { migrations } from './migrations/index';

function loadServiceAccount(): object {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as object;
  }
  const filePath = resolve(process.cwd(), 'service-account.json');
  if (existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as object;
  }
  console.error(
    'Error: FIREBASE_SERVICE_ACCOUNT env var not set and service-account.json not found.',
  );
  process.exit(1);
}

initializeApp({ credential: cert(loadServiceAccount()) });

const db = getFirestore();

async function main() {
  console.log(`\nMigration runner — ${migrations.length} migration(s) registered\n`);

  const appliedSnapshot = await db.collection('_migrations').get();
  const applied = new Set(appliedSnapshot.docs.map((d) => d.id));

  let appliedCount = 0;

  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      console.log(`  Skipped: ${migration.id} — ${migration.name}`);
      continue;
    }

    console.log(`  Applying: ${migration.id} — ${migration.name}`);
    try {
      await migration.run(db);
      await db.collection('_migrations').doc(migration.id).set({
        name: migration.name,
        appliedAt: Timestamp.now(),
      });
      console.log(`  Applied: ${migration.id} ✓`);
      appliedCount++;
    } catch (err) {
      console.error(`  Failed: ${migration.id} —`, err);
      process.exit(1);
    }
  }

  console.log(`\nDone. ${appliedCount} migration(s) applied.\n`);
}

main().catch((err) => {
  console.error('Runner error:', err);
  process.exit(1);
});
