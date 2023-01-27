import { json, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ICategory } from "../../models/tasks/task.interface";
import { CreateUserDto } from "../../models/users/createUserDto.class";
import { IUserRepository } from "../../repositories/userRepository.interface";
import { UserRepository } from "../../repositories/users.repository";
import { IUsersController } from "./users.controller.interface";



export class UsersController implements IUsersController{
    constructor (private readonly usersRepository: UserRepository) {}

    public async createUser(
        req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, 
        res: Response<any, Record<string, any>>)
        : Promise<any> {
            if (!req.body) {
                return this.jsonResponse(res, 404, "Not body passed in request" )
            }
            try {
                let userDto: CreateUserDto = {
                    username: req.body.username,
                    password: req.body.password,
                    fullname: req.body.fullname,
                    email: req.body.email
                };
                await this.usersRepository.createUser(userDto);
                return this.jsonResponse(res, 201, 'user was created successfully')/* res.status(200).json('user was created successfully'); */

            } catch(err) {
                return this.fail(res, err.toString());
            }   
    }

    public async createCategory(
        req: Request, 
        res: Response<any, Record<string, any>>)
        : Promise<any> {

            if((!req.body.idUser)) {
                return this.jsonResponse(res, 404, "Not body passed in request" )
            }
            try {
                let category: ICategory = {
                    name: req.body.name,
                    color: req.body.color
                }
                const idUser: string = req.body.idUser; 
                await this.usersRepository.createCategory( idUser, category);
                return this.jsonResponse(res, 201, 'Category created successfully')

            } catch(err){
                return this.fail(res, err.toString());
            }

    }

    public fail(res: Response<any, Record<string, any>>, error: string | Error) {
        console.log(error);
        res.type('application/json')
        return res.status(500).json({message: error.toString()});
        // The server has encountered a situation it does not know how to handle.
    }

    public jsonResponse(res: Response<any, Record<string, any>>, code: number, message: string) {
        res.type('application/json')
        return res.status(code).json({ message: message });
    }
}