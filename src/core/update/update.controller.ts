import { Body, Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UpdateService } from './update.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Update')
@Controller('updates')
export class UpdateController {

    constructor(private readonly updateService: UpdateService) {}

    @Get('check')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Returns the version of the executable POS file' })
    @ApiResponse({ status: 200, description: 'Version sent successfully' })
    @ApiResponse({ status: 401, description: 'Please, log in again' })
    @ApiResponse({ status: 404, description: 'File not found' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard ('jwt'))
    checkVersion(){
        return this.updateService.getLastestVersionFile()
    };

    @Get('download')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Authenticate a user and generate access and refresh tokens' })
    @ApiResponse({ status: 200, description: 'File sent successfully' })
    @ApiResponse({ status: 401, description: 'Please, log in again' })
    @ApiResponse({ status: 404, description: 'File not found' })
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard ('jwt'))
    downloadFile(@CurrentUser() user, @Body('deviceName') deviceName){
        const dto = {
            userId: user.sub,
            deviceId: user.device,
            name: user.name,
        }
        return this.updateService.getLastestFile(dto, deviceName);
    };
}
