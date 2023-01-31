import { CreateUserDto } from "../models/users/createUserDto.class";

export interface IPayload {
    sub: string;
    given_name: string; 
    iat?: number;
    exp?: number;
}

export interface IAuthRepository {
    createToken(id: string, fullname: string): string;
    validateToken(token: string): Promise<IPayload>;
    validateCredentials(username: string , email: string): Promise<boolean>;
    singup(createUserDto: CreateUserDto): Promise<string>;
    singin(username: string , password: string): Promise<string>;
}