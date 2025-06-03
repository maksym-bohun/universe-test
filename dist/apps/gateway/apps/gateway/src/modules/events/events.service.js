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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const nats_publisher_service_1 = require("../nats/nats-publisher.service");
let EventsService = class EventsService {
    constructor(natsPublisherService) {
        this.natsPublisherService = natsPublisherService;
    }
    async handleEvents(events) {
        for (const event of events) {
            const subject = this.getSubjectFromEvent(event);
            await this.natsPublisherService.publishEvent(subject, event);
        }
    }
    getSubjectFromEvent(event) {
        const source = event.source;
        const stage = event.funnelStage;
        return `${source === 'facebook' ? 'fb' : 'ttk'}.events.${stage}`;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_publisher_service_1.NatsPublisherService])
], EventsService);
//# sourceMappingURL=events.service.js.map