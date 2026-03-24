import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { UpdateService } from './update.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';


@Controller('updates')
export class UpdateController {

    constructor(private readonly updateService: UpdateService) {}

    @Get('check')
    @UseGuards(AuthGuard ('jwt'))
    checkVersion(){
        return this.updateService.getLastestVersionFile()
    };

    @Get('download')
    @UseGuards(AuthGuard ('jwt'))
    downloadFile(@CurrentUser() user, @Body() deviceName){

        const dto = {
            userId: user.sub,
            deviceId: user.device,
            name: user.name,
        }
        return this.updateService.getLastestFile(dto);
    };
}
