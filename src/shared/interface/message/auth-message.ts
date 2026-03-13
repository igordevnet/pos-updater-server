import { User } from "src/core/user/entity/user.entity";
import { MessageI } from "./message";

export interface AuthMessage extends MessageI {
    refreshToken: string;
    accessToken: string;
    user: User;
}