import {
  connect,
  JetStreamClient,
  JetStreamPublishOptions,
  JSONCodec,
  NatsConnection,
  StorageType,
} from 'nats';

export class NatsPublisher {
  private nc: NatsConnection;
  private js: JetStreamClient;
  private jc = JSONCodec();

  async connect() {
    this.nc = await connect({ servers: process.env.NATS_URL });
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
      } catch (err) {
        await jsm.streams.add({
          name,
          subjects,
          storage: StorageType.Memory,
        });
        console.log(`Stream ${name} created`);
      }
    }

    this.js = this.nc.jetstream();
  }

  async publish(
    subject: string,
    payload: any,
    options?: JetStreamPublishOptions,
  ) {
    if (!this.js) throw new Error('JetStream is not connected');

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
