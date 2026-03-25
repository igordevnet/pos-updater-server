import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "./entities/auth.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./repositories/auth.repository";
import { UserModule } from "../user/user.module";
import { AtStrategy } from "../../shared/modules/jwt/strategies/at.strategy";
import { TokenModule } from "src/shared/modules/jwt/token.module";
import { SecurityModule } from "src/shared/modules/security/security.module";
import { GoogleSheetsModule } from "../../shared/modules/google/google-sheets.module";

@Module({
    imports: [MongooseModule.forFeature([
        { name: Auth.name, schema: AuthSchema }
    ]),
        UserModule,
        TokenModule,
        SecurityModule,
        GoogleSheetsModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        AtStrategy
    ],
    exports: [AuthService]
})
export class AuthModule { }