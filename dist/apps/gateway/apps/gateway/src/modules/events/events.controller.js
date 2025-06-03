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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const nestjs_pino_1 = require("nestjs-pino");
const metrics_service_1 = require("../metrics/metrics.service");
let EventsController = class EventsController {
    constructor(eventsService, logger, metricsService) {
        this.eventsService = eventsService;
        this.logger = logger;
        this.metricsService = metricsService;
    }
    async handleEvent(events) {
        this.logger.debug({ events }, 'Received events');
        for (const event of events) {
            const source = 'source' in event ? event.source : 'unknown';
            this.metricsService.incAccepted(source);
        }
        try {
            await this.eventsService.handleEvents(events);
            for (const event of events) {
                const source = 'source' in event ? event.source : 'unknown';
                this.metricsService.incProcessed(source);
            }
        }
        catch (error) {
            for (const event of events) {
                const source = 'source' in event ? event.source : 'unknown';
                this.metricsService.incFailed(source, error.name || 'unknown_error');
            }
            throw error;
        }
        return { status: 'ok' };
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "handleEvent", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        nestjs_pino_1.Logger,
        metrics_service_1.MetricsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map