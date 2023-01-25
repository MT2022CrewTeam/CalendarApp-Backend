import { Role } from "./user.Schema";


export class CreateUserDto {
    fullname: string;
    username: string;
    email: string;
    password: string;
}