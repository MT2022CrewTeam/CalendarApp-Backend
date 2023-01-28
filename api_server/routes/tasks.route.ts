import { Request, Response, Router } from "express";
import { TasksController } from "../controllers/tasks/tasks.controller";

export class TaskRoute {
  public readonly router = Router({ mergeParams: true });
  constructor(private readonly tasksController: TasksController) {
    this.router.post("/:id/tasks", async (req: Request, res: Response) => {
        await this.tasksController.createTask(req, res);
    });
    this.router.patch("/:id/tasks/:idt", async (req: Request, res: Response) => {
        await this.tasksController.updateTask(req, res);
    });
    this.router.get("/:id/tasks/:idt", async (req: Request, res: Response) => {
        await this.tasksController.getTaskById(req, res);
    });    
    this.router.get("/:id/tasks", async (req: Request, res: Response) => {
        await this.tasksController.getAllTask(req, res);
    });        
    this.router.delete("/:id/tasks/:idt", async (req: Request, res: Response) => {
        await this.tasksController.deleteTask(req, res);
    });
  }    
}

