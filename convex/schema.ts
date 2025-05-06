import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  activities: defineTable({
    title: v.string(),
    description: v.string(),
    location: v.string(),
    date: v.string(),
    time: v.string(),
  }),
  bookings: defineTable({
    activityId: v.id("activities"),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
  passwords: defineTable({
    userId: v.id("users"),
    hash: v.string(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
