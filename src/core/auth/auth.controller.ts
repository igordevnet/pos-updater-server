import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { LoginDTO } from "./dtos/login.dto";
import { AuthService } from "./auth.service";
import { Tokens } from "src/shared/types/tokens.type";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";

@Controller('/auth')
export class AuthController {

    public constructor(private readonly authService: AuthService) {}
    
    @Post('/local/signin')
    @HttpCode(HttpStatus.OK)
    public login(@Body() dto: LoginDTO): Promise<Tokens> {
        return this.authService.login(dto);
    }

    @Post('/logout')
    @UseGuards(AuthGuard ('jwt'))
    @HttpCode(HttpStatus.OK)
    public async logout(@CurrentUser() user): Promise<void> {
        const dto = {
            userId: user.sub,
            deviceId: user.device
        }

        await this.authService.logout(dto);
     }

    @Post('/refresh')
    @UseGuards(AuthGuard ('jwt-refresh'))
    @HttpCode(HttpStatus.OK)
    public refreshToken(@CurrentUser() user) {
        const dto = {
            deviceId: user.device,
            refreshToken: user.refreshToken
        }

        return this.authService.refreshToken(dto);
     }
}