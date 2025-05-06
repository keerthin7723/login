import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Book an activity
export const create = mutation({
  args: {
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if activity exists
    const activity = await ctx.db.get(args.activityId);
    if (!activity) throw new Error("Activity not found");

    // Check if already booked
    const existing = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("activityId"), args.activityId))
      .unique();

    if (existing) throw new Error("Already booked");

    return await ctx.db.insert("bookings", {
      activityId: args.activityId,
      userId,
    });
  },
});

// Get user's bookings
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get activity details for each booking
    const activities = await Promise.all(
      bookings.map((booking) => ctx.db.get(booking.activityId))
    );

    return bookings.map((booking, i) => ({
      ...booking,
      activity: activities[i],
    }));
  },
});
