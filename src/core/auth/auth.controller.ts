import { Body, Controller, Param, Post } from "@nestjs/common";
import { LoginDTO } from "./dtos/login.dto";
import { AuthService } from "./auth.service";
import { Tokens } from "src/shared/types/tokens.type";

@Controller('/auth')
export class AuthController {

    public constructor(private readonly authService: AuthService) {}
    
    @Post('/local/signin')
    public login(@Body() dto: LoginDTO): Promise<Tokens> {
        return this.authService.login(dto);
    }

    @Post('logout')
    public logout(@Param('refreshToken') refreshToken: string) { }

    @Post('refresh')
    public refreshToken(@Param('refreshToken') refreshToken: string) { }
}