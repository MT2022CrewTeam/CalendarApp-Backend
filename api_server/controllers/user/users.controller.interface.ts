import { Request, Response } from "express";

export interface IUsersController {
     createUser(req: Request, res: Response): any;
     // deleteUser(req: Request): any;
     // updateUser(req: Request): any;
     // validateUserCrendentials(): any;

     fail(res: Response, error: Error | string): any;
     jsonResponse(res: Response, code: number, message: string): any;
     
}