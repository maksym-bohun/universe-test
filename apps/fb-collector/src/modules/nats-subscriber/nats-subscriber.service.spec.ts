import { Test, TestingModule } from '@nestjs/testing';
import { NatsSubscriberService } from './nats-subscriber.service';
import { PrismaService } from '@app/common/database/prisma.service';
import { NatsSubscriber } from '../../lib/nats/nats.subscriber';
import { eventSchema } from "@app/common/schemas/events.schema";

jest.mock('../../lib/nats/nats.subscriber');
jest.mock('@app/common/schemas/events.schema');
jest.mock('nanoid', () => ({ nanoid: jest.fn().mockReturnValue('test-correlation-id') }));

describe('NatsSubscriberService', () => {
    let service: NatsSubscriberService;
    let prismaService: PrismaService;
    let subscriberMock: jest.Mocked<NatsSubscriber>;

    beforeEach(async () => {
        prismaService = {
            event: {
                create: jest.fn(),
            },
        } as any;

        subscriberMock = {
            connect: jest.fn(),
            subscribe: jest.fn(),
            close: jest.fn(),
        } as any;

        (NatsSubscriber as jest.Mock).mockImplementation(() => subscriberMock);

        (eventSchema.parse as jest.Mock).mockImplementation((data) => data);

        const module: TestingModule = await Test.createTestingModule({
            providers: [NatsSubscriberService, { provide: PrismaService, useValue: prismaService }],
        }).compile();

        service = module.get<NatsSubscriberService>(NatsSubscriberService);
    });

    describe('onModuleInit', () => {
        it('should connect and subscribe to topics', async () => {
            await service.onModuleInit();

            expect(subscriberMock.connect).toHaveBeenCalled();
            expect(subscriberMock.subscribe).toHaveBeenCalledWith(
                'fb.events.top',
                expect.any(Function),
            );
            expect(subscriberMock.subscribe).toHaveBeenCalledWith(
                'fb.events.bottom',
                expect.any(Function),
            );
        });
    });

    describe('handleFacebookEvent', () => {
        it('should handle valid event and save it', async () => {
            const rawEvent = {
                eventId: 'e1',
                timestamp: '2023-01-01T00:00:00Z',
                source: 'facebook',
                funnelStage: 'top',
                eventType: 'click',
                data: {},
            };

            const handler = service['handleFacebookEvent']('top');
            await handler(rawEvent);

            expect(eventSchema.parse).toHaveBeenCalledWith(rawEvent);
            expect(prismaService.event.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    eventId: 'e1',
                    source: 'facebook',
                    funnelStage: 'top',
                    eventType: 'click',
                }),
            });
        });

        it('should log error on invalid event', async () => {
            const error = new Error('Invalid event');
            (eventSchema.parse as jest.Mock).mockImplementationOnce(() => {
                throw error;
            });

            const loggerErrorSpy = jest.spyOn(service['logger'], 'error').mockImplementation(() => {});

            const handler = service['handleFacebookEvent']('bottom');
            await handler({ invalid: 'data' });

            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to process Facebook bottom event'),
                error,
            );
        });

        it('should log error on prisma failure', async () => {
            (prismaService.event.create as jest.Mock).mockImplementationOnce(() => {
                throw new Error('DB error');
            });

            const loggerErrorSpy = jest.spyOn(service['logger'], 'error').mockImplementation(() => {});

            const rawEvent = {
                eventId: 'e2',
                timestamp: '2023-01-01T00:00:00Z',
                source: 'facebook',
                funnelStage: 'top',
                eventType: 'click',
                data: {},
            };

            const handler = service['handleFacebookEvent']('top');
            await handler(rawEvent);

            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to process Facebook top event'),
                expect.any(Error),
            );
        });
    });

    describe('onModuleDestroy', () => {
        it('should close subscriber connection', async () => {
            await service.onModuleInit();

            await service.onModuleDestroy();

            expect(subscriberMock.close).toHaveBeenCalled();
        });

        it('should not fail if subscriber is undefined', async () => {
            service['subscriber'] = undefined;
            await expect(service.onModuleDestroy()).resolves.not.toThrow();
        });
    });
});
