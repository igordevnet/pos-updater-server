import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenDTO } from 'src/core/auth/dtos/generate-token.dto';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(dto: GenerateTokenDTO): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: dto.userId,
        device: dto.deviceId,
        name: dto.name,
      },
      {
        expiresIn: 60 * 15, 
        secret: 'at-secret',
      },
    );
  }

  async generateRefreshToken(dto: GenerateTokenDTO): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: dto.userId,
        device: dto.deviceId,
        name: dto.name,
      },
      {
        secret: 'rt-secret',
      },
    );
  }
}