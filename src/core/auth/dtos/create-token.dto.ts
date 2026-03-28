import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDTO {

    @ApiProperty({ example: 'user_id', description: 'The ID of the user' })
    userId: string;

    @ApiProperty({ example: 'POS01', description: 'The name of the device' })
    deviceName: string;

    @ApiProperty({ example: 'MAC-A1-B2-C3-D4', description: 'The unique ID of the device' })
    deviceId: string;

    @ApiProperty({ example: 'refresh_token', description: 'The refresh token' })
    refreshToken: string;
}