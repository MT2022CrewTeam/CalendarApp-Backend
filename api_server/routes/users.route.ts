import express, { NextFunction, Request, Response, Router } from "express";
import { request } from "http";
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
            async (req: Request, res: Response, next: NextFunction) => {
                this.authenticator.ensureAuntheticated(req, res, next)},
            async (req: Request, res: Response) => {
                try {
                    await this.usersController.getUser(req, res);
                } catch(err) {
                    return this.failedReques(res, err);
                }
        });

        this.router.patch(
            '/:id', 
            async (req: Request, res: Response, next: NextFunction) => {
                this.authenticator.ensureAuntheticated(req, res, next)
            },
            async (req: Request, res: Response) =>{
                try {
                    await this.usersController.updateUser(req, res);
                } catch(err) {
                    return this.failedReques(res, err);
                }
        })

        this.router.delete(
            '/:id', 
            async (req: Request, res: Response, next: NextFunction) => {
                this.authenticator.ensureAuntheticated(req, res, next)
            },
            async (req: Request, res: Response) =>{
                try {
                    await this.usersController.deleteUser(req, res);
                } catch(err) {
                    return this.failedReques(res, err);
                }
        })
    }

    private failedReques (res: Response, err: Error) {
        return res.status(401).send({message: err.toString()});
    }    
    
    
}
    
