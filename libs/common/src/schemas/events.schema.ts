import { z } from "zod";

const funnelStageSchema = z.union([z.literal("top"), z.literal("bottom")]);

const facebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(["male", "female", "non-binary"]),
  location: z.object({
    country: z.string(),
    city: z.string(),
  }),
});

const facebookEngagementTopSchema = z.object({
  actionTime: z.string(),
  referrer: z.enum(["newsfeed", "marketplace", "groups"]),
  videoId: z.string().nullable(),
});

const facebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(["top_left", "bottom_right", "center"]),
  device: z.enum(["mobile", "desktop"]),
  browser: z.enum(["Chrome", "Firefox", "Safari"]),
  purchaseAmount: z.string().nullable(),
});

const facebookEngagementSchema = z.union([
  facebookEngagementTopSchema,
  facebookEngagementBottomSchema,
]);

const facebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("facebook"),
  funnelStage: funnelStageSchema,
  eventType: z.union([
    z.literal("ad.view"),
    z.literal("page.like"),
    z.literal("comment"),
    z.literal("video.view"),
    z.literal("ad.click"),
    z.literal("form.submission"),
    z.literal("checkout.complete"),
  ]),
  data: z.object({
    user: facebookUserSchema,
    engagement: facebookEngagementSchema,
  }),
});

const tiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number(),
});

const tiktokEngagementTopSchema = z.object({
  watchTime: z.number(),
  percentageWatched: z.number(),
  device: z.enum(["Android", "iOS", "Desktop"]),
  country: z.string(),
  videoId: z.string(),
});

const tiktokEngagementBottomSchema = z.object({
  actionTime: z.string(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

const tiktokEngagementSchema = z.union([
  tiktokEngagementTopSchema,
  tiktokEngagementBottomSchema,
]);

const tiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  source: z.literal("tiktok"),
  funnelStage: funnelStageSchema,
  eventType: z.union([
    z.literal("video.view"),
    z.literal("like"),
    z.literal("share"),
    z.literal("comment"),
    z.literal("profile.visit"),
    z.literal("purchase"),
    z.literal("follow"),
  ]),
  data: z.object({
    user: tiktokUserSchema,
    engagement: tiktokEngagementSchema,
  }),
});

export const eventSchema = z.discriminatedUnion("source", [
  facebookEventSchema,
  tiktokEventSchema,
]);

export type EventSchema = z.infer<typeof eventSchema>;
