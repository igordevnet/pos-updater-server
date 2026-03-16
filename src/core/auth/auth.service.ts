import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "./repositories/auth.repository";
import { LoginDTO } from "./dtos/login.dto";
import { UserService } from "../user/user.service";
import { compareData, hashData } from "src/shared/modules/security/password.util";
import { Tokens } from "src/shared/types/tokens.type";
import { JwtService } from "@nestjs/jwt";
import { GenerateTokenDTO } from "./dtos/generate-token.dto";

@Injectable()
export class AuthService {

    public constructor(
        private readonly authRepository: AuthRepository,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    public async login(dto: LoginDTO): Promise<Tokens> {
        const user = await this.userService.getUserByName(dto.name);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await compareData(dto.password, user.password);

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokenDto = {
            userId: user.id,
            deviceId: dto.deviceId,
            name: dto.name
        }

        const tokens = this.generateToken(tokenDto);

        const persistToken = {
            userId: user.id,
            deviceId: dto.deviceId,
            refreshToken: await hashData((await tokens).refresh_token)
        }

        await this.authRepository.createToken(persistToken);

        return tokens;
    }

    private async generateToken(dto: GenerateTokenDTO): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: dto.userId,
                device: dto.deviceId,
                name: dto.name
            }, {
                expiresIn: 60 * 15,
                secret: 'at-secret'
            }
            ),
            this.jwtService.signAsync({
                sub: dto.userId,
                device: dto.deviceId,
                name: dto.name
            }, {
                secret: 'rt-secret'
            }
            )
        ]);

        return {
            access_token: at,
            refresh_token: rt
        }
    }

    public logout() { }

    public refreshToken() { }
}