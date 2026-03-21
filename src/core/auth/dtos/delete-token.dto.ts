import { ApiProperty } from "@nestjs/swagger";

export class DeleteTokenDTO{
    @ApiProperty({ example: 'user_id', description: 'The ID of the user' })
    userId: string;

    @ApiProperty({ example: 'MAC-A1-B2-C3-D4', description: 'The unique ID of the device' })
    deviceId: string;
}