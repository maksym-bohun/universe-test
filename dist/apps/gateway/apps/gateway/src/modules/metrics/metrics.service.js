"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const client = require("prom-client");
let MetricsService = class MetricsService {
    constructor() {
        this.acceptedEvents = new client.Counter({
            name: 'gateway_accepted_events_total',
            help: 'Total number of accepted events',
            labelNames: ['source'],
        });
        this.processedEvents = new client.Counter({
            name: 'gateway_processed_events_total',
            help: 'Total number of processed events',
            labelNames: ['source'],
        });
        this.failedEvents = new client.Counter({
            name: 'gateway_failed_events_total',
            help: 'Total number of failed events',
            labelNames: ['source', 'error_type'],
        });
    }
    onModuleInit() {
        client.collectDefaultMetrics();
        client.register.registerMetric(this.acceptedEvents);
        client.register.registerMetric(this.processedEvents);
        client.register.registerMetric(this.failedEvents);
    }
    incAccepted(source, count = 1) {
        this.acceptedEvents.inc({ source }, count);
    }
    incProcessed(source, count = 1) {
        this.processedEvents.inc({ source }, count);
    }
    incFailed(source, errorType, count = 1) {
        this.failedEvents.inc({ source, error_type: errorType }, count);
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
//# sourceMappingURL=metrics.service.js.map