import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DownloadFileDTO {
    @ApiProperty({ example: 'user_id', description: 'The ID of the user' })
    @IsString()
    userId: string; 

    @ApiProperty({ example: 'MAC-A1-B2-C3-D4', description: 'The unique ID of the device' })
    @IsString()
    deviceId: string;

    @ApiProperty({ example: 'name_of_the_company', description: 'The name of the user' })
    @IsString()
    name: string;
}