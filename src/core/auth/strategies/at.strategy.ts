import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
    sub: string,
    device: string,
    name: string
}

export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    public constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'at-secret'
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}