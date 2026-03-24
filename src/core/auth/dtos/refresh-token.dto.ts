import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDTO {

    @ApiProperty({ example: 'MAC-A1-B2-C3-D4', description: 'The unique ID of the device' })
    @IsString()
    deviceId: string;

    @ApiProperty({ example: 'refresh_token', description: 'The refresh token' })
    @IsString()
    refreshToken: string;
}