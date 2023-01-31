import { Request, Response } from "express";
import { CreateUserDto } from "../../models/users/createUserDto.class";
import { AuthRepository } from "../../repositories/authRepository";
import { Controller } from "../controller.abstract";


export class AuthController extends Controller {
    constructor(private readonly authRepo: AuthRepository) {
        super();
    }

    public async signup (req: Request, res: Response): Promise<any> {
        this.validateEmptyBody;
        try {
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
        this.validateEmptyBody;
        try{
            const {username, password} = req.body;
            return await this.authRepo.singin(username, password);
            
        }catch(err) {
            return this.fail(res, err.toString());
        }   
    }

}