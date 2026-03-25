import { Test, TestingModule } from '@nestjs/testing';
import { StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import winVersionInfo from 'win-version-info';
import { PassThrough } from 'stream';

import { UpdateService } from './update.service';
import { UpdateRepository } from './repositories/update.repository';
import { GoogleSheetsService } from 'src/shared/modules/google/google-sheets.service';
import { DownloadFileDTO } from './dtos/download-file.dto';

jest.mock('fs');
jest.mock('win-version-info');

describe('UpdateService', () => {
  let service: UpdateService;
  let updateRepository: UpdateRepository;
  let googleSheetsService: GoogleSheetsService;

  const mockFilePath = path.join(process.cwd(), 'files', 'PdvFX.exe');
  const mockVersion = '1.0.0.123';

  const mockUpdateRepository = {
    getInstanceByDevice: jest.fn(),
    createInstance: jest.fn(),
    updateInstance: jest.fn(),
  };

  const mockGoogleSheetsService = {
    updatePdvVersion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[
        UpdateService,
        { provide: UpdateRepository, useValue: mockUpdateRepository },
        { provide: GoogleSheetsService, useValue: mockGoogleSheetsService },
      ],
    }).compile();

    service = module.get<UpdateService>(UpdateService);
    updateRepository = module.get<UpdateRepository>(UpdateRepository);
    googleSheetsService = module.get<GoogleSheetsService>(GoogleSheetsService);

    jest.clearAllMocks();

    (winVersionInfo as jest.Mock).mockReturnValue({ FileVersion: mockVersion });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLastestVersionFile', () => {
    it('should return the correct file version', () => {
      const version = service.getLastestVersionFile();

      expect(winVersionInfo).toHaveBeenCalledWith(mockFilePath);
      expect(version).toBe(mockVersion);
    });
  });

  describe('getLastestFile', () => {
    const mockDto: DownloadFileDTO = {
      userId: 'user-123',
      deviceId: 'device-456',
      name: 'Cashier 01',
    } as any; 
    const mockDeviceName = 'DESKTOP-TEST';

    let mockStream: PassThrough;

    beforeEach(() => {
      mockStream = new PassThrough();
      (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);
    });

    it('should return a StreamableFile and CREATE a new instance in the database if the device does not exist', async () => {
      mockUpdateRepository.getInstanceByDevice.mockReturnValue(null);

      const result = await service.getLastestFile(mockDto, mockDeviceName);

      expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath);
      expect(result).toBeInstanceOf(StreamableFile);

      expect(updateRepository.getInstanceByDevice).toHaveBeenCalledWith(mockDto.deviceId);
      expect(updateRepository.createInstance).toHaveBeenCalledWith({
        userId: mockDto.userId,
        deviceId: mockDto.deviceId,
        exeVersion: mockVersion,
      });
      expect(updateRepository.updateInstance).not.toHaveBeenCalled(); 

      expect(googleSheetsService.updatePdvVersion).toHaveBeenCalledWith({
        name: mockDto.name,
        deviceName: mockDeviceName,
        version: mockVersion,
      });
    });

    it('should return a StreamableFile and UPDATE the instance in the database if the device already exists', async () => {
      mockUpdateRepository.getInstanceByDevice.mockReturnValue({ id: 1, deviceId: mockDto.deviceId });

      await service.getLastestFile(mockDto, mockDeviceName);

      expect(updateRepository.getInstanceByDevice).toHaveBeenCalledWith(mockDto.deviceId);
      
      expect(updateRepository.updateInstance).toHaveBeenCalledWith({
        userId: mockDto.userId,
        deviceId: mockDto.deviceId,
        exeVersion: mockVersion,
      });
      expect(updateRepository.createInstance).not.toHaveBeenCalled(); 

      expect(googleSheetsService.updatePdvVersion).toHaveBeenCalledWith({
        name: mockDto.name,
        deviceName: mockDeviceName,
        version: mockVersion,
      });
    });
  });
});