import { GoogleApis } from "googleapis";
import { GoogleSheetsService } from "./google-sheets.service";
import { Module } from "@nestjs/common";


@Module({
    imports: [GoogleApis],
    providers: [GoogleSheetsService],
    exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}