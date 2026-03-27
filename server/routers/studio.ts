import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { tracks, transactions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "../storage";

/**
 * Studio Router - Voice synthesis, track management, and audio processing
 */

const CreateTrackInput = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  prompt: z.string().optional(),
  bpm: z.number().min(60).max(180).default(128),
  genre: z.string().optional(),
});

export const studioRouter = router({
  /**
   * Create and save a new track
   */
  createTrack: protectedProcedure
    .input(CreateTrackInput)
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Create track record
      const result = await db.insert(tracks).values({
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        prompt: input.prompt,
        bpm: input.bpm,
        genre: input.genre,
        isPublished: false,
        isForSale: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Track created successfully",
      };
    }),

  /**
   * Get user's tracks
   */
  getUserTracks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userTracks = await db
      .select()
      .from(tracks)
      .where(eq(tracks.userId, ctx.user.id));

    return userTracks;
  }),

  /**
   * Get track by ID
   */
  getTrack: protectedProcedure
    .input(z.object({ trackId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, input.trackId))
        .limit(1);

      // Verify ownership
      if (track.length === 0 || track[0].userId !== ctx.user.id) {
        throw new Error("Track not found or unauthorized");
      }

      return track[0];
    }),

  /**
   * Delete track
   */
  deleteTrack: protectedProcedure
    .input(z.object({ trackId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership first
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, input.trackId))
        .limit(1);

      if (track.length === 0 || track[0].userId !== ctx.user.id) {
        throw new Error("Track not found or unauthorized");
      }

      await db.delete(tracks).where(eq(tracks.id, input.trackId));

      return { success: true, message: "Track deleted" };
    }),

  /**
   * Save audio file to storage
   */
  saveAudioFile: protectedProcedure
    .input(
      z.object({
        trackId: z.number(),
        audioBuffer: z.instanceof(Uint8Array),
        filename: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Upload to S3
        const fileKey = `audio/${ctx.user.id}/${input.trackId}/${input.filename}`;
        const { url, key } = await storagePut(fileKey, Buffer.from(input.audioBuffer), "audio/wav");

        // Update track with audio URL
        const db = await getDb();
        if (db) {
          await db
            .update(tracks)
            .set({ audioUrl: url, audioKey: key, updatedAt: new Date() })
            .where(eq(tracks.id, input.trackId));
        }

        return {
          success: true,
          audioUrl: url,
          message: "Audio saved successfully",
        };
      } catch (error) {
        console.error("Audio save error:", error);
        throw new Error("Failed to save audio");
      }
    }),

  /**
   * Get marketplace tracks
   */
  getMarketplaceTracks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Get all tracks that are published for sale
    const marketplaceTracks = await db
      .select()
      .from(tracks)
      .where(eq(tracks.isForSale, true));

    return marketplaceTracks;
  }),

  /**
   * Publish track to marketplace
   */
  publishTrack: protectedProcedure
    .input(z.object({ trackId: z.number(), price: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify ownership
      const track = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, input.trackId))
        .limit(1);

      if (track.length === 0 || track[0].userId !== ctx.user.id) {
        throw new Error("Track not found or unauthorized");
      }

      await db
        .update(tracks)
        .set({
          isPublished: true,
          isForSale: true,
          price: input.price.toString(),
          updatedAt: new Date(),
        })
        .where(eq(tracks.id, input.trackId));

      return { success: true, message: "Track published to marketplace" };
    }),

  /**
   * Record a transaction (purchase, sale, etc)
   */
  recordTransaction: protectedProcedure
    .input(
      z.object({
        type: z.enum(["deposit", "withdrawal", "sale", "purchase"]),
        amount: z.number(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: input.type,
        amount: input.amount.toString(),
        description: input.description,
        status: "completed",
        createdAt: new Date(),
      });

      return { success: true, message: "Transaction recorded" };
    }),
});
