import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MetricsService } from '../metrics/metrics.service';
import { Logger } from 'nestjs-pino';
import { FacebookEvent } from '@app/common/interfaces/event-type.interface';

describe('EventsController', () => {
    let controller: EventsController;
    let eventsService: EventsService;
    let metricsService: MetricsService;

    const mockEvent: FacebookEvent = {
        eventId: '1',
        timestamp: new Date().toISOString(),
        source: 'facebook',
        funnelStage: 'top',
        eventType: 'page.like',
        data: {
            user: {
                userId: 'u1',
                name: 'John Doe',
                age: 25,
                gender: 'male',
                location: { city: 'Kyiv', country: 'Ukraine' },
            },
            engagement: {
                actionTime: new Date().toISOString(),
                referrer: 'newsfeed',
                videoId: null,
            },
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EventsController],
            providers: [
                {
                    provide: EventsService,
                    useValue: { handleEvents: jest.fn() },
                },
                {
                    provide: MetricsService,
                    useValue: {
                        incAccepted: jest.fn(),
                        incProcessed: jest.fn(),
                        incFailed: jest.fn(),
                    },
                },
                {
                    provide: Logger,
                    useValue: { debug: jest.fn() },
                },
            ],
        }).compile();

        controller = module.get<EventsController>(EventsController);
        eventsService = module.get<EventsService>(EventsService);
        metricsService = module.get<MetricsService>(MetricsService);
    });

    it('should accept and process events successfully', async () => {
        await expect(controller.handleEvent([mockEvent])).resolves.toEqual({
            status: 'ok',
        });

        expect(metricsService.incAccepted).toHaveBeenCalledWith('facebook');
        expect(eventsService.handleEvents).toHaveBeenCalledWith([mockEvent]);
        expect(metricsService.incProcessed).toHaveBeenCalledWith('facebook');
    });

    it('should handle errors and increment failed metric', async () => {
        jest
            .spyOn(eventsService, 'handleEvents')
            .mockRejectedValueOnce(new Error('Boom'));

        await expect(controller.handleEvent([mockEvent])).rejects.toThrow('Boom');

        expect(metricsService.incAccepted).toHaveBeenCalledWith('facebook');
        expect(metricsService.incFailed).toHaveBeenCalledWith('facebook', 'Error');
    });
});
