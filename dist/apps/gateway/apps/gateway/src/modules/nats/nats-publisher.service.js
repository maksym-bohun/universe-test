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
exports.NatsPublisherService = void 0;
const common_1 = require("@nestjs/common");
const nats_publisher_1 = require("../../lib/nats/nats.publisher");
let NatsPublisherService = class NatsPublisherService {
    constructor() {
        this.isShuttingDown = false;
        this.pendingPublishes = 0;
        console.log('[NatsPublisherService] constructor');
    }
    async onModuleInit() {
        console.log('[NatsPublisherService] onModuleInit');
        this.publisher = new nats_publisher_1.NatsPublisher();
        await this.publisher.connect();
    }
    async publishEvent(subject, payload) {
        if (this.isShuttingDown) {
            throw new Error('Service is shutting down, cannot publish new events');
        }
        this.pendingPublishes++;
        try {
            await this.publisher.publish(subject, payload);
        }
        finally {
            this.pendingPublishes--;
        }
    }
    async onModuleDestroy() {
        console.log('[NatsPublisherService] onModuleDestroy');
        await this.shutdown();
    }
    async beforeApplicationShutdown() {
        console.log('SHUTDOWN');
        await this.shutdown();
    }
    async shutdown() {
        this.isShuttingDown = true;
        while (this.pendingPublishes > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (this.publisher) {
            await this.publisher.disconnect();
        }
    }
};
exports.NatsPublisherService = NatsPublisherService;
exports.NatsPublisherService = NatsPublisherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NatsPublisherService);
//# sourceMappingURL=nats-publisher.service.js.map