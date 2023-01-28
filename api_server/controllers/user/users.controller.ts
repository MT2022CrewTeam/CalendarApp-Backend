import { json, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ICategory } from "../../models/tasks/task.interface";
import { CreateUserDto } from "../../models/users/createUserDto.class";
import { UpdateUserDto } from "../../models/users/updateUserDto.class";
import { IUser } from "../../models/users/user.interface";
import { IUserRepository } from "../../repositories/userRepository.interface";
import { UserRepository } from "../../repositories/users.repository";
import { Controller } from "../controller.abstract";
import { IUsersController } from "./users.controller.interface";



export class UsersController extends Controller implements IUsersController{
    constructor (private readonly usersRepository: UserRepository) {
        super();
    }

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
                const category: ICategory = {
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

    public async updateUser(
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, 
      res: Response<any, Record<string, any>>): Promise<any> {
      
      const authorizedUserFields: string[] = [
        'fullname', 'tasks', 'createCategories'];
      return await this.changeUser(req, res, authorizedUserFields); 
    }

    public async updateUserCrendentials(
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, 
      res: Response<any, Record<string, any>>): Promise<any> {
      
      const authorizedUserFields: string[] = ['email', 'password'];
      return await this.changeUser(req, res, authorizedUserFields); 
    }    

    public async changeUser(
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
      res: Response<any, Record<string, any>>,
      userFields: string[]): Promise<any> {
      
      if(!req.params.id) {
        this.jsonResponse(res, 404, "Not user id in request");
      }
      if(!req.body){
        this.jsonResponse(res, 404, "Not body passed in request");
      }
      try {
        let sentBody = JSON.parse(req.body);
        let updateUserDto: UpdateUserDto  = {};
        userFields.forEach((field) => {
          updateUserDto[field] = sentBody[field];
        });
        updateUserDto = this.removeNullBodyFields(updateUserDto);
        if (!updateUserDto){
          this.jsonResponse(res, 404, "passed fields not are allowed");
        }
        if (updateUserDto.password || updateUserDto.email) {
          updateUserDto['hasEmailConfirmed'] = false;
        }
        const id: string = req.params.id;
        ;
        await this.usersRepository.updateUser(id, updateUserDto)
        this.jsonResponse(res, 202, "user updated successfully" );

      } catch (err){
        this.fail(res, err.toString());
      }
    }

    public async getUser(
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, 
      res: Response<any, Record<string, any>>): Promise<any> {
      if(!req.params.id) {
       return this.jsonResponse(res, 404, "Not user id in request");
      }
      try {
        const idUser: string = req.params.id;
        const user: IUser = await this.usersRepository.findUserById(idUser);
        
        if (!user) {
          return this.jsonResponse(res, 404, "Not found user associated with passed id");
        }

        delete user.password;
        res.type('application/json');
        return res.status(200).json({ user });
        
      } catch(err) {
        return this.fail(res, err.toString());
      }
    }

    public async deleteUser(
      req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, 
      res: Response<any, Record<string, any>>): Promise<any> {
      
      if(!req.params.id) {
        return this.jsonResponse(res, 404, "Not user id in request");
      }      
      
      try {
        const idUser: string = req.params.id;
        await this.usersRepository.deleteUser(idUser);
        res.type('application/json')
        this.jsonResponse(res, 200, 'User was deleted successfully')


      } catch(err){
        return this.fail(res, err.toString());
      }

    }
        
}


