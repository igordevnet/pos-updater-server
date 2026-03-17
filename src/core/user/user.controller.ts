import { Controller, Patch, Post, Get, Delete, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UserService } from "./user.service";

@Controller('/user')
export class UserController {
    public constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public createUser(@Body() dto: CreateUserDTO){
        return this.userService.createUser(dto)
    }

    @Patch()
    public updateUser(){}

    @Get()
    public getUser() {}

    @Delete(':id')
    public deleteUser() {}
}