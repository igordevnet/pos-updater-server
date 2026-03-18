import { User } from "src/core/user/entities/user.entity";
import { MessageI } from "./message";

export interface AuthMessage extends MessageI {
    refreshToken: string;
    accessToken: string;
    user: User;
}