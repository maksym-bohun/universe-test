"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsSubscriber = void 0;
const nats_1 = require("nats");
class NatsSubscriber {
    constructor() {
        this.jc = (0, nats_1.JSONCodec)();
        this.isClosed = false;
    }
    async connect() {
        this.nc = await (0, nats_1.connect)({ servers: process.env.NATS_URL });
        this.js = this.nc.jetstream();
        this.jsm = await this.nc.jetstreamManager();
        try {
            await this.jsm.streams.info('TTK_EVENTS');
        }
        catch {
            await this.jsm.streams.add({
                name: 'TTK_EVENTS',
                subjects: ['ttk.events.>'],
                storage: nats_1.StorageType.File,
            });
        }
    }
    async subscribe(subjectPattern, onMessage) {
        if (!this.js) {
            throw new Error('JetStream is not initialized');
        }
        const opts = (0, nats_1.consumerOpts)();
        opts.durable('ttk-collector-durable-' + subjectPattern.replace(/\W/g, '_'));
        opts.ackExplicit();
        opts.filterSubject(subjectPattern);
        const sub = await this.js.pullSubscribe(subjectPattern, opts);
        const pullSub = sub;
        let pulling = false;
        this.pullInterval = setInterval(async () => {
            if (this.isClosed || pulling)
                return;
            pulling = true;
            try {
                await pullSub.pull({ batch: 10, expires: 5000 });
            }
            catch (err) {
                console.error('Pull error:', err);
            }
            finally {
                pulling = false;
            }
        }, 1000);
        (async () => {
            for await (const msg of sub) {
                try {
                    const payload = this.jc.decode(msg.data);
                    await onMessage(payload);
                    msg.ack();
                }
                catch (err) {
                    console.error('Error while handling message', err);
                    msg.term();
                }
            }
        })();
    }
    async close() {
        this.isClosed = true;
        if (this.pullInterval) {
            clearInterval(this.pullInterval);
        }
        if (this.nc) {
            await this.nc.close();
        }
    }
}
exports.NatsSubscriber = NatsSubscriber;
//# sourceMappingURL=nats.subscriber.js.map