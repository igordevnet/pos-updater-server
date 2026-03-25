import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { SecurityService } from "../../shared/modules/security/security.service";
import { UserRepository } from "./repositories/user.repository";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

const mockSecurityService = {
    hashData: jest.fn(),
};

const mockUserRepository = {
    getUserByCNPJ: jest.fn(),
    createUser: jest.fn(),
    getUserByName: jest.fn(),
    getUserById: jest.fn(),
};

const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
}

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: SecurityService, useValue: mockSecurityService },
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: CACHE_MANAGER, useValue: mockCache },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        service['cacheManager'] = mockCache as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const dto = { name: 'test_name', password: 'plain_password', cnpj: '12345678000195' };

            mockUserRepository.getUserByCNPJ.mockResolvedValue(null);

            mockSecurityService.hashData.mockResolvedValue('hashed_password');

            const result = await service.createUser(dto);

            expect(result).toEqual({ message: "User created successfully." });
            expect(mockUserRepository.getUserByCNPJ).toHaveBeenCalledWith('12345678000195');
            expect(mockSecurityService.hashData).toHaveBeenCalledWith('plain_password');

            expect(mockUserRepository.createUser).toHaveBeenCalledWith({
                ...dto,
                password: 'hashed_password'
            });
        });
    });

    describe('throwIfCnpjIsInUse', () => {
        it('should throw an error if the CNPJ is already in use', async () => {
            const cnpj = '12345678000195';
            mockUserRepository.getUserByCNPJ.mockResolvedValue({ id: '1', name: 'test_name', cnpj });

            expect(service['throwIfCnpjIsInUse'](cnpj)).rejects.toThrow('This CNPJ is already in use.');
            expect(mockUserRepository.getUserByCNPJ).toHaveBeenCalledWith(cnpj);
        });
    });

    describe('getUserByName', () => {
        it('should return a user by name when there is no user in cache', async () => {
            const name = 'test_name';
            const cacheKey = `auth_user_${name}`

            const cachedUser = null;

            const user = { id: '1', name, cnpj: '12345678000195' };

            mockCache.get.mockResolvedValue(cachedUser);
            mockUserRepository.getUserByName.mockResolvedValue(user);

            const result = await service.getUserByName(name);

            expect(result).toEqual(user);
            expect(mockUserRepository.getUserByName).toHaveBeenCalledWith(name);
            expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
            expect(mockCache.set).toHaveBeenCalledWith(cacheKey, user, 300000);
        });

        it('should return a user by name when there is a user in cache', async () => {
            const name = 'test_name';
            const cacheKey = `auth_user_${name}`

            const cachedUser = { id: '1', name, cnpj: '12345678000195' };

            mockCache.get.mockResolvedValue(cachedUser);

            const result = await service.getUserByName(name);

            expect(result).toEqual(cachedUser);
            expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
        });
    });

    describe('getUserById', () => {
        it('should return a user by id when there is no user in cache', async () => {
            const id = '1';
            const cacheKey = `auth_user_${id}`

            const cachedUser = null;

            const user = { id, name: 'test_name', cnpj: '12345678000195' };

            mockCache.get.mockResolvedValue(cachedUser);
            mockUserRepository.getUserById.mockResolvedValue(user);

            const result = await service.getUserById(id);

            expect(result).toEqual(user);
            expect(mockUserRepository.getUserById).toHaveBeenCalledWith(id);
            expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
            expect(mockCache.set).toHaveBeenCalledWith(cacheKey, user, 300000);
        });

        it('should return a user by id when there is a user in cache', async () => {
            const id = '1';
            const cacheKey = `auth_user_${id}`

            const cachedUser = { id, name: 'test_name', cnpj: '12345678000195' };

            mockCache.get.mockResolvedValue(cachedUser);

            const result = await service.getUserById(id);

            expect(result).toEqual(cachedUser);
            expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
        });
    });
});