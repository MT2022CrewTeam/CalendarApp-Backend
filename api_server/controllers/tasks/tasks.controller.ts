import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { update } from "lodash";
import { ParsedQs } from "qs";
import { json } from "stream/consumers";
import { CreateTaskDto } from "../../models/tasks/createTaskDto";
import { ITask } from "../../models/tasks/task.interface";
import { UpdateTaskDto } from "../../models/tasks/updateTaskDto";
import { UserRepository } from "../../repositories/users.repository";
import { Controller } from "../controller.abstract";
import { ITaskController } from "./tasks.controller.interface";

export interface IUpdateParams {
  idUser: string,
  idTask: string,
  taskFields: ITask
}


export class TasksController extends Controller implements ITaskController {
  private taskFields = [
    "title",
    "startDate",
    "endDate",
    "status",
    "progress",
    "categories",
    "reminders",
  ];
  
  constructor(private readonly usersRepository: UserRepository) {
    super();
  }
  private getUserAndTaskIds(req: Request) {
    const idUser: string = req.params.id
      ? req.params.id
      : req.query.id
      ? req.query.id
      : req.body.idUser;
    const idTask: string = req.params.idt
      ? req.params.idt
      : req.query.idt
      ? req.query.idt
      : req.body.idTask;
    return [idUser, idTask];
  }

  private validateIfTaskIdPassed(req, res): void {
    if (!req.params.idt && !req.body.idTask && !req.query.idt) {
      throw new Error("task ID not was passed in request");
    }
  }  
  public async createTask(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {

    try {
      this.validateEmptyBody(req, res);
      this.validateIfUserIdPassed(req, res);
      const taskFields: CreateTaskDto = {
        title: req.body.title,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
      };
      const taskDto = this.removeNullBodyFields(taskFields);
      if (Object.keys(taskDto).length !== 3) {
        this.jsonResponse(
          res,
          404,
          "passed body fields not match the minimun required to create a task"
        );
      }
      const idUser: string = req.body.idUser ? req.body.idUser : req.params.id;
      console.log(idUser);
      await this.usersRepository.createTask(idUser, taskDto as CreateTaskDto);
      return this.jsonResponse(res, 201, "task was created successfully");
    } catch (err) {
      return this.fail(res, err.toString());
    }
  }
  public buildUpdateParameters(    
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>): IUpdateParams {
      
        this.validateEmptyBody(req, res);
        this.validateIfUserIdPassed(req, res);
        if (!req.params.idt && !req.body.idTask && !req.query.idt) {
          throw new Error("task ID not was passed in request");
        }      
        let updateTaskDto: ITask;
        for (let field in this.taskFields) {
          updateTaskDto[this.taskFields[field]] = req.body[this.taskFields[field]];
        }
        
        const [idUser, idTask] = this.getUserAndTaskIds(req);
        return {idUser: idUser, 
                idTask: idTask, 
                taskFields: updateTaskDto}

    }
  public async patchTask(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) { }


  public async updateTask(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      const {idUser, idTask, taskFields} = this.buildUpdateParameters(req, res);
      await this.usersRepository.putTask(idUser, idTask, taskFields);

      return this.jsonResponse(res, 201, "task was updated successfully");
    } catch (err) {
      return this.fail(res, err.toString());
    }    
    }  

  public async getTaskById(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      this.validateIfUserIdPassed(req, res);
      const [idUser, idTask] = this.getUserAndTaskIds(req);
      console.log(`idUse:${idUser} `); //- idTask:${idTask}
      const task: ITask = await this.usersRepository.getTaskById(
        idUser,
        idTask
      );
      return this.jsonReturn(res, 200, task);
    } catch (err) {
      return this.fail(res, err.toString());
    }
  }

  public async getAllTask(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {
    try {
      this.validateIfUserIdPassed(req, res);
      const tasks: ITask[] = await this.usersRepository.getAllTasks(
      req.params.id
    );
      return this.jsonReturn(res, 200, tasks);
    } catch (err) {
      return this.fail(res, err.toString());
    }
  }

  // public async getTaskByDate(req: Request, res: Response) {
  //   this.validateIfUserIdPassed(req, res);
  //   try {
  //     const [idUser, idTask] = this.getUserAndTaskIds(req);
  //     const rangeDate = {
  //       startDate: req.body.startDate,
  //       endDate: req.body.endDate
  //     }
  //     const tasks = await this.usersRepository.getTasksByDate(rangeDate);

  //   } catch (err) {
  //     return this.fail(res, err.toString());
  //   }
  // }

  public async deleteTask(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ) {

    try {
      this.validateIfUserIdPassed(req, res);
      this.validateIfTaskIdPassed(req, res);
      const [idUser, idTask] = this.getUserAndTaskIds(req);
      await this.usersRepository.deleteTask(idUser, idTask);
      return this.jsonResponse(res, 200, "task was deleted successfully");
    } catch (err) {
      return this.fail(res, err.toString());
    }
  }

  public async getTasksByDate(    
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
    ) {
      try {
        this.validateIfUserIdPassed(req, res);
        if (!req.body.startDate){
          throw new Error ("Not date passed in request");
        }        
        const endDate = req.body.endDate ? req.body.endDate: req.body.starDate;
        const startDate = req.body.startDate;
        const [idUser, idTask] = this.getUserAndTaskIds(req);
        const tasks = await this.usersRepository.getTasksByDate(
          {
            idUser, startDate, endDate
          });
        return this.jsonReturn(res, 200, tasks);
        
      } catch(err) {
        this.fail(res, err.toString());
      }
    }

}
