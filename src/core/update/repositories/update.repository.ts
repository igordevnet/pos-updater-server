import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Update } from "../entities/update.entity";
import { UpdateDTO } from "../dtos/update.dto";

export class UpdateRepository {
    public constructor(
        @InjectModel('Update')
        private readonly updateModel: Model<Update>
    ) { }

    public async createInstance(dto: UpdateDTO) {
        const instance = await new this.updateModel(dto);
        await instance.save();
    }

    public async updateInstance(dto: UpdateDTO) {
        await this.updateModel.updateOne(
            { deviceId: dto.deviceId }, 
            { exeVersion: dto.exeVersion }
        );
    }

    public async getInstanceByDevice(deviceId: string) {
        return this.updateModel.findOne({ deviceId });
    }
}


