import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../entity/user.entity";
import { Model } from "mongoose";
import { CreateUserDTO } from "../dto/create-user.dto";

export class UserRepository {
    public constructor (
        @InjectModel('User')
        private readonly userModel: Model<UserDocument>
    ) {}

    public async createUser(dto: CreateUserDTO) {
        const createdUser = new this.userModel(dto);
        return createdUser.save();
    }

    public getUserByCNPJ(cnpj: string) {
        return this.userModel.findOne({cnpj}).exec();
    }
}