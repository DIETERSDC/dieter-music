import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tracks, sales, transactions, InsertTrack, InsertSale, InsertTransaction } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Marketplace queries
export async function getUserTracks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tracks).where(eq(tracks.userId, userId)).orderBy(desc(tracks.createdAt));
}

export async function getMarketplaceTracks(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tracks)
    .where(and(eq(tracks.isPublished, true), eq(tracks.isForSale, true)))
    .orderBy(desc(tracks.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createTrack(track: InsertTrack) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tracks).values(track);
  return result;
}

export async function updateTrack(trackId: number, updates: Partial<InsertTrack>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tracks).set(updates).where(eq(tracks.id, trackId));
}

export async function createSale(sale: InsertSale) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(sales).values(sale);
}

export async function getUserSalesHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sales).where(eq(sales.sellerId, userId)).orderBy(desc(sales.createdAt));
}

export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(transactions).values(transaction);
}

export async function updateUserWallet(userId: number, newBalance: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(users).set({ walletBalance: newBalance }).where(eq(users.id, userId));
}
