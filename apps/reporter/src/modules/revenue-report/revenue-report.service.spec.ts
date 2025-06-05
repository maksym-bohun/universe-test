import { Test, TestingModule } from '@nestjs/testing';
import { RevenueReportService } from './revenue-report.service';
import { PrismaService } from '@app/common/database/prisma.service';

describe('RevenueReportService', () => {
    let service: RevenueReportService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RevenueReportService,
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

        service = module.get(RevenueReportService);
        prisma = module.get(PrismaService);
    });

    it('should return grouped revenue report', async () => {
        const mockDto = {
            from: '2024-01-01T00:00:00Z',
            to: '2024-12-31T23:59:59Z',
        };

        (prisma.event.groupBy as jest.Mock).mockResolvedValue([
            {
                source: 'web',
                funnelStage: 'purchase',
                eventType: 'checkout',
                _sum: { revenue: 250 },
            },
        ]);

        const result = await service.getReport(mockDto);

        expect(result).toEqual([
            {
                source: 'web',
                funnelStage: 'purchase',
                eventType: 'checkout',
                totalRevenue: 250,
            },
        ]);
    });
});
