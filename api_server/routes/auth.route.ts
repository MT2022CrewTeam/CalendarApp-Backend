import { Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth/auth.controller";
import { Authentication } from "../controllers/middleware/authentication.middleware";


export class AuthRoute {
    public readonly router = Router({mergeParams: true});
    constructor (private readonly authController: AuthController) {
        this.router.post('/signup', async (req: Request, res: Response) => {
            await this.authController.signup(req, res);
        })
        this.router.post('/signin', async (req: Request, res: Response) => {
            await this.authController.signin(req, res);
        })
    }

}