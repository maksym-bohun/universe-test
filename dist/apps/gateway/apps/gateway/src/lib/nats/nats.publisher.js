"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsPublisher = void 0;
const nats_1 = require("nats");
class NatsPublisher {
    constructor() {
        this.jc = (0, nats_1.JSONCodec)();
    }
    async connect() {
        this.nc = await (0, nats_1.connect)({ servers: process.env.NATS_URL });
        const jsm = await this.nc.jetstreamManager();
        const streams = [
            {
                name: 'FB_EVENTS',
                subjects: ['fb.events.>'],
            },
            {
                name: 'TTK_EVENTS',
                subjects: ['ttk.events.>'],
            },
        ];
        for (const { name, subjects } of streams) {
            try {
                await jsm.streams.info(name);
                console.log(`Stream ${name} already exists`);
            }
            catch (err) {
                await jsm.streams.add({
                    name,
                    subjects,
                    storage: nats_1.StorageType.Memory,
                });
                console.log(`Stream ${name} created`);
            }
        }
        this.js = this.nc.jetstream();
    }
    async publish(subject, payload, options) {
        if (!this.js)
            throw new Error('JetStream is not connected');
        const data = this.jc.encode(payload);
        const ack = await this.js.publish(subject, data, options);
        if (!ack || !ack.seq) {
            throw new Error('JetStream publish failed');
        }
    }
    async disconnect() {
        await this.nc.close();
    }
}
exports.NatsPublisher = NatsPublisher;
//# sourceMappingURL=nats.publisher.js.map