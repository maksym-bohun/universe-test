"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRevenue = extractRevenue;
function extractRevenue(event) {
    if (event.source === "facebook") {
        if (event.funnelStage === "bottom" &&
            event.eventType === "checkout.complete" &&
            "purchaseAmount" in event.data.engagement &&
            event.data.engagement.purchaseAmount) {
            return Number(event.data.engagement.purchaseAmount);
        }
    }
    else if (event.source === "tiktok") {
        if (event.funnelStage === "bottom" &&
            event.eventType === "purchase" &&
            "purchaseAmount" in event.data.engagement &&
            event.data.engagement.purchaseAmount) {
            return Number(event.data.engagement.purchaseAmount);
        }
    }
    return null;
}
//# sourceMappingURL=extract-revenue.util.js.map