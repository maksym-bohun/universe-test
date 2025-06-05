import { Test, TestingModule } from '@nestjs/testing';
import { EventsReportService } from './events-report.service';
import { PrismaService } from '@app/common/database/prisma.service';

describe('EventsReportService', () => {
    let service: EventsReportService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsReportService,
                {
                    provide: PrismaService,
                    useValue: {
                        event: {
                            groupBy: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get(EventsReportService);
        prisma = module.get(PrismaService);
    });

    it('should return grouped events', async () => {
        const mockDto = {
            from: '2024-01-01T00:00:00Z',
            to: '2024-12-31T23:59:59Z',
        };

        (prisma.event.groupBy as jest.Mock).mockResolvedValue([
            {
                source: 'web',
                funnelStage: 'awareness',
                eventType: 'click',
                _count: { _all: 5 },
            },
        ]);

        const result = await service.getReport(mockDto);

        expect(result).toEqual([
            {
                source: 'web',
                funnelStage: 'awareness',
                eventType: 'click',
                count: 5,
            },
        ]);
    });
});
