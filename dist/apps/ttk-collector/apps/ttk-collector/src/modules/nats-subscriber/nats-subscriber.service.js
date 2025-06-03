"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NatsSubscriberService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsSubscriberService = void 0;
const common_1 = require("@nestjs/common");
const nats_subscriber_1 = require("../../lib/nats/nats.subscriber");
const prisma_service_1 = require("../../../../../libs/common/src/database/prisma.service");
const events_schema_1 = require("../../../../../libs/common/src/schemas/events.schema");
const nanoid_1 = require("nanoid");
const correlation_id_1 = require("../../../../../libs/common/src/logger/correlation-id");
const extract_revenue_util_1 = require("../../../../../libs/common/src/utils/extract-revenue.util");
let NatsSubscriberService = NatsSubscriberService_1 = class NatsSubscriberService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.logger = new common_1.Logger(NatsSubscriberService_1.name);
    }
    async onModuleInit() {
        this.logger.log('Initializing NatsSubscriberService...');
        this.subscriber = new nats_subscriber_1.NatsSubscriber();
        await this.subscriber.connect();
        await this.subscriber.subscribe('ttk.events.top', this.handleTiktokEvent('top'));
        await this.subscriber.subscribe('ttk.events.bottom', this.handleTiktokEvent('bottom'));
        this.logger.log('Subscribed to NATS topics');
    }
    handleTiktokEvent(stage) {
        return async (rawEvent) => {
            const correlationId = (0, correlation_id_1.getCorrelationId)() || (0, nanoid_1.nanoid)();
            (0, correlation_id_1.addCorrelationId)(correlationId);
            this.logger.verbose(`[${correlationId}] Received Tiktok ${stage} event`);
            try {
                const event = events_schema_1.eventSchema.parse(rawEvent);
                const revenue = (0, extract_revenue_util_1.extractRevenue)(event);
                await this.prismaService.event.create({
                    data: {
                        eventId: event.eventId,
                        timestamp: new Date(event.timestamp),
                        source: event.source,
                        funnelStage: event.funnelStage,
                        eventType: event.eventType,
                        data: event.data,
                        revenue,
                    },
                });
                this.logger.log(`[${correlationId}] Tiktok ${stage} event persisted: ${event.eventId}`);
            }
            catch (error) {
                this.logger.error(`[${correlationId}] Failed to process Tiktok ${stage} event`, error);
            }
        };
    }
    async onModuleDestroy() {
        if (this.subscriber) {
            await this.subscriber.close();
            this.logger.log('NATS connection closed');
        }
    }
};
exports.NatsSubscriberService = NatsSubscriberService;
exports.NatsSubscriberService = NatsSubscriberService = NatsSubscriberService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NatsSubscriberService);
//# sourceMappingURL=nats-subscriber.service.js.map