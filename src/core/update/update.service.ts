import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import winVersionInfo from 'win-version-info';
import { SaveUpdateDTO } from './dtos/save-update.dto';
import { UpdateRepository } from './repositories/update.repository';
import { GoogleSheetsService } from '../../shared/modules/google/google-sheets.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Version } from 'src/shared/types/version-response.type';


@Injectable()
export class UpdateService {

    private readonly filePath;

    public constructor(
        private readonly updateRepository: UpdateRepository, 
        private readonly googleSheetsService: GoogleSheetsService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        this.filePath = join(process.cwd(), 'files', 'PdvFX.exe');
    }

    public async getLastestVersionFile(): Promise<Version> {
        const cacheKey = 'version_file';

        const cachedVersion = await this.cacheManager.get<string>(cacheKey);
        if(cachedVersion) {
            return {
                version: cachedVersion,
            };
        }

        const info = await winVersionInfo(this.filePath);
        await this.cacheManager.set(cacheKey, info.FileVersion, 300000);

        return {
            version: info.FileVersion,
        };
    }

    public async getLastestFile() {

        const fileStream = createReadStream(this.filePath);

        return new StreamableFile(fileStream, {
            type: 'application/octet-stream',
            disposition: 'attachment; filename="pdv.exe"',
        });
    }

    public async saveAndExport(dto: SaveUpdateDTO, deviceName: string) {
        const version = await this.getLastestVersionFile();
        
        const payload = {
            userId: dto.userId,
            deviceId: dto.deviceId,
            exeVersion: version.version,
        };

        const instanceCompare = await this.updateRepository.getInstanceByDevice(dto.deviceId);

        if(!instanceCompare) {
            await this.updateRepository.createInstance(payload);
        } 
        else {
            await this.updateRepository.updateInstance(payload);
        }

        const payloadSheet = {
            name: dto.name,
            deviceName,
            version: version.version,
        };

        await this.googleSheetsService.updatePdvVersion(payloadSheet);
    }
}