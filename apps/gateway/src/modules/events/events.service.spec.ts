import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { NatsPublisherService } from '../nats/nats-publisher.service';
import { FacebookEvent } from '@app/common/interfaces/event-type.interface';

describe('EventsService', () => {
    let service: EventsService;
    let natsPublisherService: NatsPublisherService;

    const mockEvent: FacebookEvent = {
        eventId: '1',
        timestamp: new Date().toISOString(),
        source: 'facebook',
        funnelStage: 'bottom',
        eventType: 'ad.click',
        data: {
            user: {
                userId: 'u1',
                name: 'John Doe',
                age: 25,
                gender: 'male',
                location: { city: 'Kyiv', country: 'Ukraine' },
            },
            engagement: {
                adId: '123',
                campaignId: '456',
                clickPosition: 'center',
                device: 'desktop',
                browser: 'Chrome',
                purchaseAmount: null,
            },
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: NatsPublisherService,
                    useValue: { publishEvent: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
        natsPublisherService = module.get<NatsPublisherService>(NatsPublisherService);
    });

    it('should publish each event to NATS with correct subject', async () => {
        await service.handleEvents([mockEvent]);

        expect(natsPublisherService.publishEvent).toHaveBeenCalledWith(
            'fb.events.bottom',
            mockEvent,
        );
    });
});
