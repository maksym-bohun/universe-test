"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSchema = void 0;
const zod_1 = require("zod");
const funnelStageSchema = zod_1.z.union([zod_1.z.literal("top"), zod_1.z.literal("bottom")]);
const facebookUserSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    name: zod_1.z.string(),
    age: zod_1.z.number(),
    gender: zod_1.z.enum(["male", "female", "non-binary"]),
    location: zod_1.z.object({
        country: zod_1.z.string(),
        city: zod_1.z.string(),
    }),
});
const facebookEngagementTopSchema = zod_1.z.object({
    actionTime: zod_1.z.string(),
    referrer: zod_1.z.enum(["newsfeed", "marketplace", "groups"]),
    videoId: zod_1.z.string().nullable(),
});
const facebookEngagementBottomSchema = zod_1.z.object({
    adId: zod_1.z.string(),
    campaignId: zod_1.z.string(),
    clickPosition: zod_1.z.enum(["top_left", "bottom_right", "center"]),
    device: zod_1.z.enum(["mobile", "desktop"]),
    browser: zod_1.z.enum(["Chrome", "Firefox", "Safari"]),
    purchaseAmount: zod_1.z.string().nullable(),
});
const facebookEngagementSchema = zod_1.z.union([
    facebookEngagementTopSchema,
    facebookEngagementBottomSchema,
]);
const facebookEventSchema = zod_1.z.object({
    eventId: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    source: zod_1.z.literal("facebook"),
    funnelStage: funnelStageSchema,
    eventType: zod_1.z.union([
        zod_1.z.literal("ad.view"),
        zod_1.z.literal("page.like"),
        zod_1.z.literal("comment"),
        zod_1.z.literal("video.view"),
        zod_1.z.literal("ad.click"),
        zod_1.z.literal("form.submission"),
        zod_1.z.literal("checkout.complete"),
    ]),
    data: zod_1.z.object({
        user: facebookUserSchema,
        engagement: facebookEngagementSchema,
    }),
});
const tiktokUserSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    username: zod_1.z.string(),
    followers: zod_1.z.number(),
});
const tiktokEngagementTopSchema = zod_1.z.object({
    watchTime: zod_1.z.number(),
    percentageWatched: zod_1.z.number(),
    device: zod_1.z.enum(["Android", "iOS", "Desktop"]),
    country: zod_1.z.string(),
    videoId: zod_1.z.string(),
});
const tiktokEngagementBottomSchema = zod_1.z.object({
    actionTime: zod_1.z.string(),
    profileId: zod_1.z.string().nullable(),
    purchasedItem: zod_1.z.string().nullable(),
    purchaseAmount: zod_1.z.string().nullable(),
});
const tiktokEngagementSchema = zod_1.z.union([
    tiktokEngagementTopSchema,
    tiktokEngagementBottomSchema,
]);
const tiktokEventSchema = zod_1.z.object({
    eventId: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    source: zod_1.z.literal("tiktok"),
    funnelStage: funnelStageSchema,
    eventType: zod_1.z.union([
        zod_1.z.literal("video.view"),
        zod_1.z.literal("like"),
        zod_1.z.literal("share"),
        zod_1.z.literal("comment"),
        zod_1.z.literal("profile.visit"),
        zod_1.z.literal("purchase"),
        zod_1.z.literal("follow"),
    ]),
    data: zod_1.z.object({
        user: tiktokUserSchema,
        engagement: tiktokEngagementSchema,
    }),
});
exports.eventSchema = zod_1.z.discriminatedUnion("source", [
    facebookEventSchema,
    tiktokEventSchema,
]);
//# sourceMappingURL=events.schema.js.map