import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { hashData } from "src/shared/modules/security/password.util";
import { MessageI } from "src/shared/interfaces/message/message";

@Injectable()
export class UserService {
    public constructor(
        private readonly userRepository: UserRepository
    ) { }

    public async createUser(dto: CreateUserDTO): Promise<MessageI> {
        await this.throwIfCnpjIsInUse(dto.cnpj);

        dto.password = await hashData(dto.password);

        await this.userRepository.createUser(dto);

        return {message: "User created successfully."}
    }

    private async throwIfCnpjIsInUse(cnpj: string) {
        const user = await this.userRepository.getUserByCNPJ(cnpj);

        if (user) throw new BadRequestException("This CNPJ is already in use.");
    }

    public getUserByName(name: string) {
        return this.userRepository.getUserByName(name);
    }

    public getUserById(id: string) {
        return this.userRepository.getUserById(id);
    }
}