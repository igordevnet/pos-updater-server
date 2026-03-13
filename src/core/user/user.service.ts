import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import { CreateUserDTO } from "./dto/create-user.dto";
import { hashPassword } from "src/shared/module/security/password.util";
import { MessageI } from "src/shared/interface/message/message";

@Injectable()
export class UserService {
    public constructor(
        private readonly userRepository: UserRepository
    ) { }

    public async createUser(dto: CreateUserDTO): Promise<MessageI> {
        await this.throwIfCnpjIsInUse(dto.cnpj);

        dto.password = await hashPassword(dto.password);

        await this.userRepository.createUser(dto);

        return {message: "User created successfully."}
    }

    private async throwIfCnpjIsInUse(cnpj: string) {
        const user = await this.userRepository.getUserByCNPJ(cnpj);

        if (user) throw new BadRequestException("This CNPJ is already in use.");
    }
}