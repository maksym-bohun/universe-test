import {
  connect,
  JetStreamClient,
  JSONCodec,
  NatsConnection,
  consumerOpts,
  JetStreamManager,
  StorageType,
  JetStreamPullSubscription,
} from 'nats';

export class NatsSubscriber {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private jc = JSONCodec();

  private pullInterval?: NodeJS.Timeout;
  private isClosed = false;

  async connect() {
    this.nc = await connect({ servers: process.env.NATS_URL });
    this.js = this.nc.jetstream();
    this.jsm = await this.nc.jetstreamManager();

    try {
      await this.jsm.streams.info('FB_EVENTS');
    } catch {
      await this.jsm.streams.add({
        name: 'FB_EVENTS',
        subjects: ['fb.events.>'],
        storage: StorageType.File,
      });
    }
  }

  async subscribe(
    subjectPattern: string,
    onMessage: (data: any) => Promise<void>,
  ) {
    if (!this.js) {
      throw new Error('JetStream is not initialized');
    }

    const opts = consumerOpts();
    opts.durable('fb-collector-durable-' + subjectPattern.replace(/\W/g, '_'));
    opts.ackExplicit();
    opts.filterSubject(subjectPattern);

    const sub = await this.js.pullSubscribe(subjectPattern, opts);
    const pullSub = sub as JetStreamPullSubscription;

    let pulling = false;

    this.pullInterval = setInterval(async () => {
      if (this.isClosed || pulling) return;
      pulling = true;

      try {
        await pullSub.pull({ batch: 10, expires: 5000 });
      } catch (err) {
        console.error('Pull error:', err);
      } finally {
        pulling = false;
      }
    }, 1000);

    (async () => {
      for await (const msg of sub) {
        try {
          const payload = this.jc.decode(msg.data);
          await onMessage(payload);
          msg.ack();
        } catch (err) {
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
