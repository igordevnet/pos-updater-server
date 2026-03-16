import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    public constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'at-secret'
        });
    }

    validate(payload: any) {
        return payload;
    }
}