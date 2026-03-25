import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({ example: 'name_of_the_company', description: 'The name of the user' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'User_password_123', description: 'The password of the user' })
    @IsString()
    password: string;

    
    @ApiProperty({ example: 'PDV01', description: 'The name of the device' })
    @IsString()
    deviceName: string;

    @ApiProperty({ example: 'MAC-A1-B2-C3-D4', description: 'The unique ID of the device' })
    @IsString()
    deviceId: string;
}