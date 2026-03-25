import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from '@nestjs/config';
import { SecurityService } from "./security.service";
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
        return '10';
    }),
};

describe('SecurityService', () => {
    let service: SecurityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SecurityService,
                { provide: ConfigService, useValue: mockConfigService }
            ],
        }).compile();

        service = module.get<SecurityService>(SecurityService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should generate a string hash correctly', async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

        const result = await service.hashData('myPassword');

        expect(result).toBe('hashedPassword');
        expect(bcrypt.hash).toHaveBeenCalledWith('myPassword', expect.any(Number));
    });

    it('Should return true if the hashes match', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await service.compareData('myPassword', 'hashedPassword');

        expect(result).toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith('myPassword', 'hashedPassword');
    });
})