import { Test, TestingModule } from '@nestjs/testing';
import { DemographicsReportService } from './demographics-report.service';
import { PrismaService } from '@app/common/database/prisma.service';

describe('DemographicsReportService', () => {
    let service: DemographicsReportService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DemographicsReportService,
                {
                    provide: PrismaService,
                    useValue: {
                        event: {
                            findMany: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get(DemographicsReportService);
        prisma = module.get(PrismaService);
    });

    it('should group demographics data correctly', async () => {
        const mockDto = {
            from: '2024-01-01T00:00:00Z',
            to: '2024-12-31T23:59:59Z',
        };

        (prisma.event.findMany as jest.Mock).mockResolvedValue([
            {
                data: JSON.stringify({
                    user: {
                        gender: 'female',
                        age: 25,
                        location: { country: 'Ukraine', city: 'Kyiv' },
                    },
                }),
            },
            {
                data: JSON.stringify({
                    user: {
                        gender: 'female',
                        age: 25,
                        location: { country: 'Ukraine', city: 'Kyiv' },
                    },
                }),
            },
            {
                data: JSON.stringify({
                    user: {
                        gender: 'male',
                        age: 30,
                        location: { country: 'USA', city: 'NYC' },
                    },
                }),
            },
        ]);

        const result = await service.getReport(mockDto);

        expect(result).toEqual([
            {
                gender: 'female',
                age: 25,
                country: 'Ukraine',
                city: 'Kyiv',
                count: 2,
            },
            {
                gender: 'male',
                age: 30,
                country: 'USA',
                city: 'NYC',
                count: 1,
            },
        ]);
    });
});
