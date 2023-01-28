import { Request, Response } from "express";

export interface ITaskController {

     // validateUserCrendentials(): any;
     createTask(req: Request, res: Response): any;
     deleteTask(req: Request, res: Response): any;
     getTaskById(req: Request, res: Response): any;
     updateTask(req: Request, res: Response): any;
}