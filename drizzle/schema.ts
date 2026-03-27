import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  walletBalance: decimal("walletBalance", { precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User-generated music tracks
export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  prompt: text("prompt"), // Original AI generation prompt
  audioUrl: text("audioUrl"), // S3 URL to the audio file
  audioKey: text("audioKey"), // S3 file key for reference
  duration: int("duration"), // Duration in seconds
  bpm: int("bpm").default(128),
  genre: varchar("genre", { length: 100 }),
  isPublished: boolean("isPublished").default(false),
  isForSale: boolean("isForSale").default(false),
  price: decimal("price", { precision: 8, scale: 2 }),
  rentalPrice: decimal("rentalPrice", { precision: 8, scale: 2 }),
  plays: int("plays").default(0),
  downloads: int("downloads").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = typeof tracks.$inferInsert;

// Track purchases and rentals
export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  trackId: int("trackId").notNull(),
  sellerId: int("sellerId").notNull(), // User who created/owns the track
  buyerId: int("buyerId").notNull(), // User who purchased
  saleType: mysqlEnum("saleType", ["buy", "rent"]).notNull(),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  expiresAt: timestamp("expiresAt"), // For rentals, when access expires
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

// Wallet transactions
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["deposit", "withdrawal", "sale", "purchase"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;