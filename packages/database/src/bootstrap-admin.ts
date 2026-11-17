import { db, pool } from './client';
import { users } from './schema/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

async function bootstrapAdmin() {
  const username = process.argv[2] || 'admin';
  const secretKey = process.env.ADMIN_BOOTSTRAP_SECRET;

  if (!secretKey) {
    console.error('ERROR: ADMIN_BOOTSTRAP_SECRET is not configured in .env');
    process.exit(1);
  }

  console.log(`[BOOTSTRAP] Checking administrative user: "${username}"...`);

  try {
    const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (existing.length > 0) {
      if (existing[0].role !== 'admin') {
        await db.update(users).set({ role: 'admin' }).where(eq(users.id, existing[0].id));
        console.log(`[BOOTSTRAP] Successfully elevated user "${username}" to role: "admin"!`);
      } else {
        console.log(`[BOOTSTRAP] User "${username}" is already an administrator.`);
      }
    } else {
      const adminId = crypto.randomUUID();
      const internalEmail = `account-${adminId}@internal.matric.invalid`;

      await db.insert(users).values({
        id: adminId,
        name: 'Matric Administrator',
        username,
        email: internalEmail,
        nickname: 'AdminFalcon01',
        role: 'admin',
        isGuest: false,
        xp: 1000,
        level: 10,
      });

      console.log(`[BOOTSTRAP] Successfully initialized first administrator account!`);
      console.log(`  User ID: ${adminId}`);
      console.log(`  Username: ${username}`);
      console.log(`  Role: admin`);
    }
  } catch (err) {
    console.error('[BOOTSTRAP] Failed to execute database operation:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

bootstrapAdmin();
