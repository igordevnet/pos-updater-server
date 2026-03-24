import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";
import { IsCNPJ } from "src/shared/decorators/validators/cnpj.validator";

export class CreateUserDTO {
    @ApiProperty({ example: 'name_of_the_company', description: 'The name of the user' })
    @IsString()
    name: string;

    @ApiProperty({ example: '35109230000178', description: 'The CNPJ of the user' })
    @IsCNPJ()
    cnpj: string;

    @ApiProperty({ example: 'User_password_123', description: 'The password of the user' })
    @IsStrongPassword()
    password: string;
}
