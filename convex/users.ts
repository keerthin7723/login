import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import bcrypt from "bcryptjs";

export const createUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(args.password, salt);
    
    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.email.split("@")[0], // Default name is email prefix
    });

    // Store hashed password
    await ctx.db.insert("passwords", {
      userId,
      hash,
    });

    return userId;
  },
});

export const verifyPassword = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", q => q.eq("email", args.email))
      .unique();
    
    if (!user) {
      return false;
    }

    // Get password hash
    const password = await ctx.db
      .query("passwords")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .unique();

    if (!password) {
      return false;
    }

    // Verify password
    return await bcrypt.compare(args.password, password.hash);
  },
});
