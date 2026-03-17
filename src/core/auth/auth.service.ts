import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "./repositories/auth.repository";
import { LoginDTO } from "./dtos/login.dto";
import { UserService } from "../user/user.service";
import { compareData, hashData } from "src/shared/modules/security/password.util";
import { Tokens } from "src/shared/types/tokens.type";
import { DeleteTokenDTO } from "./dtos/delete-token.dto";
import { RefreshTokenDTO } from "./dtos/refresh-token.dto";
import { TokenService } from "src/shared/modules/jwt/token.service";
import { Hash } from "crypto";
import { CreateTokenDTO } from "./dtos/create-token.dto";

@Injectable()
export class AuthService {

    public constructor(
        private readonly authRepository: AuthRepository,
        private readonly userService: UserService,
        private readonly tokenService: TokenService
    ) { }

    public async login(dto: LoginDTO): Promise<Tokens> {
        const user = await this.userService.getUserByName(dto.name);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatches = await compareData(dto.password, user.password);

        if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

        const tokenDto = {
            userId: user.id,
            deviceId: dto.deviceId,
            name: dto.name
        }

        const refreshToken = await this.tokenService.generateRefreshToken(tokenDto);
        const accessToken = await this.tokenService.generateAccessToken(tokenDto);

        const persistToken = {
            userId: user.id,
            deviceId: dto.deviceId,
            refreshToken: await hashData(refreshToken)
        }

        await this.authRepository.createToken(persistToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }


    public async logout(dto: DeleteTokenDTO): Promise<void> {
        await this.authRepository.deleteToken(dto.userId, dto.deviceId);
    }

    public async refreshToken(dto: RefreshTokenDTO) {
        const authEntity = await this.authRepository.getEntityByDevice(dto.deviceId);

        if (!authEntity) throw new UnauthorizedException('Please, log in again');

        const rtMatches = await compareData(dto.refreshToken, authEntity.refreshToken);

        if (!rtMatches) throw new UnauthorizedException('Please, log in againn');

        const user = await this.userService.getUserById(authEntity.userId);

        if (!user) throw new UnauthorizedException('Please, log in againnn');

        await this.authRepository.deleteToken(authEntity.userId, authEntity.deviceId);

        const tokenDto = {
            userId: user.id,
            deviceId: dto.deviceId,
            name: user.name
        }

        const refreshToken = await this.tokenService.generateRefreshToken(tokenDto);
        const accessToken = await this.tokenService.generateAccessToken(tokenDto);

        const persistToken = {
            userId: user.id,
            deviceId: dto.deviceId,
            refreshToken: await hashData(refreshToken)
        }

        await this.authRepository.createToken(persistToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }
}