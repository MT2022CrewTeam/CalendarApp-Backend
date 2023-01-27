import { Request, Response } from "express";

export interface IUsersController {

     
     // validateUserCrendentials(): any;
     createUser(req: Request, res: Response): any;
     deleteUser(req: Request, res: Response): any;
     getUser(req: Request, res: Response): any;
     updateUser(req: Request, res: Response): any;
}