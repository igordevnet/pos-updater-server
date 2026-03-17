import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

type JwtPayload = {
    sub: string,
    device: string,
    name: string
}

export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    public constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'rt-secret',
            passReqToCallback: true
        });
    }

    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
        return {
            ...payload,
            refreshToken
        };
    }
}