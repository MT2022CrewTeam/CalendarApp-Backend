import express, { Request, Response, Router } from "express";
import { UsersController } from "../controllers/user/users.controller";

export class UserRoute {
    private router = Router();
    constructor (private readonly usersController: UsersController) {

        this.router.post('/', async (req: Request, res: Response) =>{
            this.usersController.createUser(req, res);
        });
        this.router.post('/categories', async(req: Request<{id: string}>, res: Response) => {
            this.usersController.createCategory(req, res);
        });

    }

    
    
    
}
    
