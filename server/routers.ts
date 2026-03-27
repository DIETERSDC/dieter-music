import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  marketplace: router({
    // Get all published tracks for sale
    getTracks: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(({ input }) => db.getMarketplaceTracks(input.limit, input.offset)),
    
    // Get user's own tracks
    getUserTracks: protectedProcedure
      .query(({ ctx }) => db.getUserTracks(ctx.user.id)),
    
    // Create a new track
    createTrack: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        prompt: z.string(),
        audioUrl: z.string(),
        audioKey: z.string(),
        duration: z.number(),
        bpm: z.number().default(128),
        genre: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => 
        db.createTrack({
          userId: ctx.user.id,
          ...input,
        })
      ),
    
    // Publish/list track for sale
    publishTrack: protectedProcedure
      .input(z.object({
        trackId: z.number(),
        price: z.string(),
        rentalPrice: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => 
        db.updateTrack(input.trackId, {
          isPublished: true,
          isForSale: true,
          price: input.price,
          rentalPrice: input.rentalPrice,
        })
      ),
    
    // Get user's sales history
    getSalesHistory: protectedProcedure
      .query(({ ctx }) => db.getUserSalesHistory(ctx.user.id)),
    
    // Get user wallet balance
    getWallet: protectedProcedure
      .query(({ ctx }) => db.getUserByOpenId(ctx.user.openId)),
  }),
});

export type AppRouter = typeof appRouter;
