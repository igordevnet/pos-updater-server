import { IsString, IsStrongPassword } from "class-validator";
import { IsCNPJ } from "src/shared/validators/cnpj.validator";

export class CreateUserDTO {
    @IsString()
    name: string;

    @IsCNPJ()
    cnpj: string;

    @IsStrongPassword()
    password: string;
}
