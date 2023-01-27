import express, { Request, Response, Router } from "express";
import { UsersController } from "../controllers/user/users.controller";

export class UserRoute {
    public readonly router = Router({mergeParams:true});
    constructor (private readonly usersController: UsersController) {

        this.router.post('/', async (req: Request, res: Response) =>{
            await this.usersController.createUser(req, res);
        });

        this.router.get('/:id', async (req: Request, res: Response) =>{
            await this.usersController.getUser(req, res);
        });

        this.router.patch('/:id', async (req: Request, res: Response) =>{
            await this.usersController.updateUser(req, res);
        })

        this.router.delete('/:id', async (req: Request, res: Response) =>{
            await this.usersController.deleteUser(req, res);
        })
        // this.router.post('/categories', async(req: Request<{id: string}>, res: Response) => {
            // this.usersController.createCategory(req, res);
        // });
    }

    
    
    
}
    
