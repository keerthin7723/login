import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all activities (public)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activities").collect();
  },
});

// Create activity (admin only - we'll add admin check later)
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", args);
  },
});

// Add initial activities right now
export const addInitialActivities = mutation({
  args: {},
  handler: async (ctx) => {
    // Add new activities
    const activities = [
      {
        title: "IPL Cricket Match: MI vs CSK",
        description: "Watch the exciting T20 cricket match between Mumbai Indians and Chennai Super Kings",
        location: "Wankhede Stadium, Mumbai",
        date: "2024-04-15",
        time: "7:30 PM",
      },
      {
        title: "Premier League: Arsenal vs Liverpool",
        description: "Premier League clash between Arsenal and Liverpool",
        location: "Emirates Stadium, London",
        date: "2024-04-20",
        time: "3:00 PM",
      },
      {
        title: "Movie Premiere: Avengers 5",
        description: "Be among the first to watch the latest Marvel blockbuster",
        location: "IMAX Cinema, Downtown",
        date: "2024-04-25",
        time: "8:00 PM",
      },
      {
        title: "NBA Basketball: Lakers vs Warriors",
        description: "Exciting NBA matchup between LA Lakers and Golden State Warriors",
        location: "Crypto.com Arena, Los Angeles",
        date: "2024-04-18",
        time: "6:00 PM",
      },
      {
        title: "Tennis Grand Slam: Wimbledon Finals",
        description: "Watch the men's singles final match at the prestigious Wimbledon Championship",
        location: "All England Club, London",
        date: "2024-07-14",
        time: "2:00 PM",
      },
      {
        title: "Concert: Taylor Swift Eras Tour",
        description: "Experience Taylor Swift's record-breaking Eras Tour live",
        location: "Madison Square Garden, New York",
        date: "2024-05-01",
        time: "7:00 PM",
      }
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }
  },
});
