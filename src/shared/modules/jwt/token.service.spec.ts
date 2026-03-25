import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('deve gerar um JWT com sucesso usando a chave secreta', async () => {
      const dto = { userId: '123', deviceId: 'PDV-01', name: 'admin' };
      
      mockConfigService.get.mockReturnValue('minha_chave_secreta_falsa');
      mockJwtService.signAsync.mockResolvedValue('meu.jwt.falso');

      const result = await service.generateAccessToken(dto);

      expect(result).toBe('meu.jwt.falso');
      expect(mockConfigService.get).toHaveBeenCalledWith('AT_KEY');
      expect(mockJwtService.signAsync).toHaveBeenCalled();
    });

    it('deve lançar um erro se a variável de ambiente AT_KEY não existir', async () => {
      const dto = { userId: '123', deviceId: 'PDV-01', name: 'admin' };
      
      mockConfigService.get.mockReturnValue(undefined); 

      await expect(service.generateAccessToken(dto)).rejects.toThrow('Invalid atSecret env variable');
    });
  });

  describe('generateRefreshToken', () => {
    it('deve gerar um token opaco hexadecimal de 64 caracteres', async () => {
      const result = await service.generateRefreshToken();

      expect(result).toBeDefined();
      expect(result.length).toBe(64); 
    });
  });
});