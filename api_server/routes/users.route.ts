import express, { Request, Response, Router } from "express";
import { Authentication } from "../controllers/middleware/authentication.middleware";
import { UsersController } from "../controllers/user/users.controller";

export class UserRoute {
    public readonly router = Router({mergeParams:true});
    constructor (private readonly usersController: UsersController,
                 private readonly authenticator: Authentication) {

        // this.router.post('/', async (req: Request, res: Response) =>{
        //     await this.usersController.createUser(req, res);
        // });

        this.router.get(
            '/:id', 
            this.authenticator.ensureAuntheticated,
            async (req: Request, res: Response) =>{
                await this.usersController.getUser(req, res);
        });

        this.router.patch(
            '/:id', 
            this.authenticator.ensureAuntheticated,
            async (req: Request, res: Response) =>{
                await this.usersController.updateUser(req, res);
        })

        this.router.delete(
            '/:id', 
            this.authenticator.ensureAuntheticated,
            async (req: Request, res: Response) =>{
                await this.usersController.deleteUser(req, res);
        })

        this.router.post(
            '/:id/categories', 
            this.authenticator.ensureAuntheticated,
            async(req: Request, res: Response) => {
                this.usersController.createCategory(req, res);
        });
    }

    
    
    
}
    
