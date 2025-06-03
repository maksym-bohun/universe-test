import { z } from "zod";
export declare const eventSchema: z.ZodDiscriminatedUnion<"source", [z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodString;
    source: z.ZodLiteral<"facebook">;
    funnelStage: z.ZodUnion<[z.ZodLiteral<"top">, z.ZodLiteral<"bottom">]>;
    eventType: z.ZodUnion<[z.ZodLiteral<"ad.view">, z.ZodLiteral<"page.like">, z.ZodLiteral<"comment">, z.ZodLiteral<"video.view">, z.ZodLiteral<"ad.click">, z.ZodLiteral<"form.submission">, z.ZodLiteral<"checkout.complete">]>;
    data: z.ZodObject<{
        user: z.ZodObject<{
            userId: z.ZodString;
            name: z.ZodString;
            age: z.ZodNumber;
            gender: z.ZodEnum<["male", "female", "non-binary"]>;
            location: z.ZodObject<{
                country: z.ZodString;
                city: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                country?: string;
                city?: string;
            }, {
                country?: string;
                city?: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            userId?: string;
            age?: number;
            gender?: "male" | "female" | "non-binary";
            location?: {
                country?: string;
                city?: string;
            };
        }, {
            name?: string;
            userId?: string;
            age?: number;
            gender?: "male" | "female" | "non-binary";
            location?: {
                country?: string;
                city?: string;
            };
        }>;
        engagement: z.ZodUnion<[z.ZodObject<{
            actionTime: z.ZodString;
            referrer: z.ZodEnum<["newsfeed", "marketplace", "groups"]>;
            videoId: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            actionTime?: string;
            referrer?: "newsfeed" | "marketplace" | "groups";
            videoId?: string;
        }, {
            actionTime?: string;
            referrer?: "newsfeed" | "marketplace" | "groups";
            videoId?: string;
        }>, z.ZodObject<{
            adId: z.ZodString;
            campaignId: z.ZodString;
            clickPosition: z.ZodEnum<["top_left", "bottom_right", "center"]>;
            device: z.ZodEnum<["mobile", "desktop"]>;
            browser: z.ZodEnum<["Chrome", "Firefox", "Safari"]>;
            purchaseAmount: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            adId?: string;
            campaignId?: string;
            clickPosition?: "top_left" | "bottom_right" | "center";
            device?: "mobile" | "desktop";
            browser?: "Chrome" | "Firefox" | "Safari";
            purchaseAmount?: string;
        }, {
            adId?: string;
            campaignId?: string;
            clickPosition?: "top_left" | "bottom_right" | "center";
            device?: "mobile" | "desktop";
            browser?: "Chrome" | "Firefox" | "Safari";
            purchaseAmount?: string;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        user?: {
            name?: string;
            userId?: string;
            age?: number;
            gender?: "male" | "female" | "non-binary";
            location?: {
                country?: string;
                city?: string;
            };
        };
        engagement?: {
            actionTime?: string;
            referrer?: "newsfeed" | "marketplace" | "groups";
            videoId?: string;
        } | {
            adId?: string;
            campaignId?: string;
            clickPosition?: "top_left" | "bottom_right" | "center";
            device?: "mobile" | "desktop";
            browser?: "Chrome" | "Firefox" | "Safari";
            purchaseAmount?: string;
        };
    }, {
        user?: {
            name?: string;
            userId?: string;
            age?: number;
            gender?: "male" | "female" | "non-binary";
            location?: {
                country?: string;
                city?: string;
            };
        };
        engagement?: {
            actionTime?: string;
            referrer?: "newsfeed" | "marketplace" | "groups";
            videoId?: string;
        } | {
            adId?: string;
            campaignId?: string;
            clickPosition?: "top_left" | "bottom_right" | "center";
            device?: "mobile" | "desktop";
            browser?: "Chrome" | "Firefox" | "Safari";
            purchaseAmount?: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    eventId?: string;
    timestamp?: string;
    source?: "facebook";
    funnelStage?: "top" | "bottom";
    eventType?: "ad.view" | "page.like" | "comment" | "video.view" | "ad.click" | "form.submission" | "checkout.complete";
    data?: {
        user?: {
            name?: string;
            userId?: string;
            age?: number;
            gender?: "male" | "female" | "non-binary";
            location?: {
                country?: string;
                city?: string;
            };
        };
        engagement?: {
            actionTime?: string;
            referrer?: "newsfeed" | "marketplace" | "groups";
            videoId?: string;
        } | {
            adId?: string;
            campaignId?: string;
            clickPosition?: "top_left" | "bottom_right" | "center";
            device?: "mobile" | "desktop";
            browser?: "Chrome" | "Firefox" | "Safari";
            purchaseAmount?: string;
        };
    };
}, {
    eventId?: string;
    timestamp?: string;
    source?: "facebook";
    funnelStage?: "top" | "bottom";
    eventType?: "ad.view" | "page.like" | "comment" | "video.view" | "ad.click" | "form.submission" | "checkout.complete";
    data?: {
        user?: {
            name?: string;
            userId?: string;
            age?: number;
            gender?: "male" | "female" | "non-binary";
            location?: {
                country?: string;
                city?: string;
            };
        };
        engagement?: {
            actionTime?: string;
            referrer?: "newsfeed" | "marketplace" | "groups";
            videoId?: string;
        } | {
            adId?: string;
            campaignId?: string;
            clickPosition?: "top_left" | "bottom_right" | "center";
            device?: "mobile" | "desktop";
            browser?: "Chrome" | "Firefox" | "Safari";
            purchaseAmount?: string;
        };
    };
}>, z.ZodObject<{
    eventId: z.ZodString;
    timestamp: z.ZodString;
    source: z.ZodLiteral<"tiktok">;
    funnelStage: z.ZodUnion<[z.ZodLiteral<"top">, z.ZodLiteral<"bottom">]>;
    eventType: z.ZodUnion<[z.ZodLiteral<"video.view">, z.ZodLiteral<"like">, z.ZodLiteral<"share">, z.ZodLiteral<"comment">, z.ZodLiteral<"profile.visit">, z.ZodLiteral<"purchase">, z.ZodLiteral<"follow">]>;
    data: z.ZodObject<{
        user: z.ZodObject<{
            userId: z.ZodString;
            username: z.ZodString;
            followers: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            userId?: string;
            username?: string;
            followers?: number;
        }, {
            userId?: string;
            username?: string;
            followers?: number;
        }>;
        engagement: z.ZodUnion<[z.ZodObject<{
            watchTime: z.ZodNumber;
            percentageWatched: z.ZodNumber;
            device: z.ZodEnum<["Android", "iOS", "Desktop"]>;
            country: z.ZodString;
            videoId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            country?: string;
            videoId?: string;
            device?: "Android" | "iOS" | "Desktop";
            watchTime?: number;
            percentageWatched?: number;
        }, {
            country?: string;
            videoId?: string;
            device?: "Android" | "iOS" | "Desktop";
            watchTime?: number;
            percentageWatched?: number;
        }>, z.ZodObject<{
            actionTime: z.ZodString;
            profileId: z.ZodNullable<z.ZodString>;
            purchasedItem: z.ZodNullable<z.ZodString>;
            purchaseAmount: z.ZodNullable<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            actionTime?: string;
            purchaseAmount?: string;
            profileId?: string;
            purchasedItem?: string;
        }, {
            actionTime?: string;
            purchaseAmount?: string;
            profileId?: string;
            purchasedItem?: string;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        user?: {
            userId?: string;
            username?: string;
            followers?: number;
        };
        engagement?: {
            country?: string;
            videoId?: string;
            device?: "Android" | "iOS" | "Desktop";
            watchTime?: number;
            percentageWatched?: number;
        } | {
            actionTime?: string;
            purchaseAmount?: string;
            profileId?: string;
            purchasedItem?: string;
        };
    }, {
        user?: {
            userId?: string;
            username?: string;
            followers?: number;
        };
        engagement?: {
            country?: string;
            videoId?: string;
            device?: "Android" | "iOS" | "Desktop";
            watchTime?: number;
            percentageWatched?: number;
        } | {
            actionTime?: string;
            purchaseAmount?: string;
            profileId?: string;
            purchasedItem?: string;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    eventId?: string;
    timestamp?: string;
    source?: "tiktok";
    funnelStage?: "top" | "bottom";
    eventType?: "comment" | "video.view" | "like" | "share" | "profile.visit" | "purchase" | "follow";
    data?: {
        user?: {
            userId?: string;
            username?: string;
            followers?: number;
        };
        engagement?: {
            country?: string;
            videoId?: string;
            device?: "Android" | "iOS" | "Desktop";
            watchTime?: number;
            percentageWatched?: number;
        } | {
            actionTime?: string;
            purchaseAmount?: string;
            profileId?: string;
            purchasedItem?: string;
        };
    };
}, {
    eventId?: string;
    timestamp?: string;
    source?: "tiktok";
    funnelStage?: "top" | "bottom";
    eventType?: "comment" | "video.view" | "like" | "share" | "profile.visit" | "purchase" | "follow";
    data?: {
        user?: {
            userId?: string;
            username?: string;
            followers?: number;
        };
        engagement?: {
            country?: string;
            videoId?: string;
            device?: "Android" | "iOS" | "Desktop";
            watchTime?: number;
            percentageWatched?: number;
        } | {
            actionTime?: string;
            purchaseAmount?: string;
            profileId?: string;
            purchasedItem?: string;
        };
    };
}>]>;
