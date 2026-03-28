import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class NotifyDownloadDto {
    @ApiProperty({ example: 'POS01', description: 'The name of the device that downloaded the file' })
    @IsString()
    deviceName: string;
}