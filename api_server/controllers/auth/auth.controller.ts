import { Request, Response } from "express";
import { CreateUserDto } from "../../models/users/createUserDto.class";
import { AuthRepository } from "../../repositories/authRepository";
import { Controller } from "../controller.abstract";


export class AuthController extends Controller {
    private readonly createUserDtoFields: string[] = [
        "username", "email", "password", "fullname"
    ];

    constructor(private readonly authRepo: AuthRepository) {
        super();
    }

    public async signup (req: Request, res: Response): Promise<any> {
        
        try {
            this.validateEmptyBody(req, res);
            this.validateUserDto(req.body);
            let userDto: CreateUserDto = {
                username: req.body.username,
                password: req.body.password,
                fullname: req.body.fullname,
                email: req.body.email
            };

            const token = await this.authRepo.singup(userDto);
            return res.status(201).send({"token": token})
        } catch(err) {
            return this.fail(res, err.toString());
        }   
    }

    public async signin (req: Request, res: Response): Promise<any> {
        
        try{
            this.validateEmptyBody(req, res);
            const {username, password} = req.body;
            const token = await this.authRepo.singin(username, password);
            console.log(token);
            return res.status(201).send({"token": token});

        }catch(err) {
            return this.fail(res, err.toString());
        }   
    }

    private validateUserDto(body: {[k: string]: string}){
        this.createUserDtoFields.forEach(field =>{
            if(!body[field]){
                throw new Error ("User info doesn't follow dto interface")
            }
        })
    }

}