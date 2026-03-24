import { IsString } from "class-validator";

export class testDTO {
    @IsString()
    name: string;
    @IsString()
    deviceName: string;
    @IsString()
    version: string;
}