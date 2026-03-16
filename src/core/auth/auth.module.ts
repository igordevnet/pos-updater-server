import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "./entities/auth.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./repositories/auth.repository";
import { UserModule } from "../user/user.module";
import { AtStrategy } from "./strategies/at.strategy";
import { RtStrategy } from "./strategies/rt.strategy";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [MongooseModule.forFeature([
        { name: Auth.name, schema: AuthSchema }
    ]),
        UserModule,
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        AtStrategy,
        RtStrategy
    ],
    exports: [AuthService]
})
export class AuthModule { }