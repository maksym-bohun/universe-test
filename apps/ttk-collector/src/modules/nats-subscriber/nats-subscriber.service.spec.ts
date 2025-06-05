import { Test, TestingModule } from '@nestjs/testing';
import { NatsSubscriberService } from './nats-subscriber.service';
import { PrismaService } from '@app/common/database/prisma.service';
import { NatsSubscriber } from '../../lib/nats/nats.subscriber';
import { eventSchema } from '@app/common/schemas/events.schema';
import * as correlationId from '@app/common/logger/correlation-id';
import * as extractRevenueUtil from '@app/common/utils/extract-revenue.util';

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
        jest.spyOn(correlationId, 'getCorrelationId').mockReturnValue(undefined);
        jest.spyOn(correlationId, 'addCorrelationId').mockImplementation(() => {});
        jest.spyOn(extractRevenueUtil, 'extractRevenue').mockReturnValue(123.45);

        const module: TestingModule = await Test.createTestingModule({
            providers: [NatsSubscriberService, { provide: PrismaService, useValue: prismaService }],
        }).compile();

        service = module.get<NatsSubscriberService>(NatsSubscriberService);
    });

    describe('onModuleInit', () => {
        it('should connect and subscribe to TikTok topics', async () => {
            await service.onModuleInit();

            expect(subscriberMock.connect).toHaveBeenCalled();
            expect(subscriberMock.subscribe).toHaveBeenCalledWith(
                'ttk.events.top',
                expect.any(Function),
            );
            expect(subscriberMock.subscribe).toHaveBeenCalledWith(
                'ttk.events.bottom',
                expect.any(Function),
            );
        });
    });

    describe('handleTiktokEvent', () => {
        it('should handle valid event and save it with revenue', async () => {
            const rawEvent = {
                eventId: 'e1',
                timestamp: '2023-01-01T00:00:00Z',
                source: 'tiktok',
                funnelStage: 'top',
                eventType: 'view',
                data: {},
            };

            const handler = service['handleTiktokEvent']('top');
            await handler(rawEvent);

            expect(eventSchema.parse).toHaveBeenCalledWith(rawEvent);
            expect(extractRevenueUtil.extractRevenue).toHaveBeenCalledWith(rawEvent);
            expect(prismaService.event.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    eventId: 'e1',
                    source: 'tiktok',
                    funnelStage: 'top',
                    eventType: 'view',
                    revenue: 123.45,
                }),
            });
        });

        it('should log error if event is invalid', async () => {
            const error = new Error('Invalid event');
            (eventSchema.parse as jest.Mock).mockImplementationOnce(() => {
                throw error;
            });

            const loggerErrorSpy = jest.spyOn(service['logger'], 'error').mockImplementation(() => {});

            const handler = service['handleTiktokEvent']('bottom');
            await handler({});

            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to process Tiktok bottom event'),
                error,
            );
        });

        it('should log error if prisma fails', async () => {
            (prismaService.event.create as jest.Mock).mockImplementationOnce(() => {
                throw new Error('DB failure');
            });

            const loggerErrorSpy = jest.spyOn(service['logger'], 'error').mockImplementation(() => {});

            const rawEvent = {
                eventId: 'e2',
                timestamp: '2023-01-01T00:00:00Z',
                source: 'tiktok',
                funnelStage: 'top',
                eventType: 'click',
                data: {},
            };

            const handler = service['handleTiktokEvent']('top');
            await handler(rawEvent);

            expect(loggerErrorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Failed to process Tiktok top event'),
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
