import { IUserRepository } from "./userRepository.interface";
import { MongooseConnection } from "../database";
import { ICategory, IReminder, ITask } from "../models/tasks/task.interface";
import { IUser } from "../models/users/user.interface";
import mongoose, { Model } from "mongoose";
import { Role, User, UserDocument, userSchema } from "../models/users/user.Schema";
import { CreateUserDto } from "../models/users/createUserDto.class";
import { UpdateUserDto } from "../models/users/updateUserDto.class";
import { isEqual } from "lodash"
import { CreateTaskDto } from "../models/tasks/createTaskDto";
import { taskStatus } from "../models/tasks/task.Schema";
import { UpdateTaskDto } from "../models/tasks/updateTaskDto";

export class UserRepository implements IUserRepository {
  private readonly userModel;
  constructor(private connection: MongooseConnection) {
    this.userModel = this.connection.mongoose.model(
      "user",
      userSchema,
      "Users"
    );
  }

  private findElementInArray(elementToFind: any, array: any[]): boolean {
    const elementExists = array.findIndex(
      (element) => {
        delete element._id;
        isEqual(element, elementToFind)}
    );
    if (elementExists === -1) {
      return false;
    }
    return true;
  }

  private findTaskById(user: IUser, idTask: string): number {
    const index = user.tasks.findIndex(task => String(task._id) === idTask);
    if (index === -1) {
      throw new Error('Task was not found');
    }
    return index
  }  

  private findTask(
    task: CreateTaskDto,
    userTasks: ITask[],
    taskComparisonCriteria = ["title", "startDate", "endDate"]
  ): boolean {
    let conditionsFullfilled;
    userTasks.forEach(function (userTask) {
      conditionsFullfilled = 0;
      taskComparisonCriteria.forEach(function (field) {
        let isEqual: boolean = false;
        if (task[field] instanceof Date){
          isEqual = task[field].getTime() === userTask[field].getTime()
        } else {
          isEqual = task[field] === userTask[field]
        }
        if (isEqual) {
          conditionsFullfilled += 1;
        };
      });
    });
    if (conditionsFullfilled === taskComparisonCriteria.length) {
      return true;
    }
    return false;
  }

  public async createCategory(
    id: string,
    newCategory: ICategory
  ): Promise<any> {
    const user: IUser = await this.findUserById(id); /* await this.userModel.findOne({"_id": id}); */
    console.log(user);
    const categoryExists = user.createdCategories.
    findIndex((element) => element.color === newCategory.color 
    && element.name === newCategory.name);

    if (categoryExists !== -1) {
      console.log("here");
      throw new Error ("Category already exists");
    }
    user.createdCategories.push(newCategory);
    console.log(user);
    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async createReminder(
    id: string,
    idTask: string,
    newReminder: IReminder
  ) {
    const user: IUser = await this.findUserById(id);
    const taskIndex: number = this.findTaskById(user, idTask);

    user.tasks[taskIndex].reminders.push(newReminder); //verify if reminder exists
    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async createTask(id: string, taskDto: CreateTaskDto) {
    const user = await this.findUserById(id);
    
    const taskExists = this.findTask(taskDto, user.tasks);
    if (taskExists) {
      throw new Error ("Task already exists");
    }
    const newTask: ITask = {
      title: taskDto.title,
      startDate: taskDto.startDate,
      endDate: taskDto.endDate,
      status: taskStatus.in_progress,
      progress: 0,
      categories: taskDto.categories ? taskDto.categories : [],
      reminders: taskDto.reminders ? taskDto.reminders : []
    } 

    user.tasks.push(newTask); //preguntar si se permiten dos tareas con mismo nombre y tiempo
    return await this.userModel.updateOne({ _id: id }, user);

  }

  public async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    let newUser: IUser = {
    fullname: createUserDto.fullname,
    username: createUserDto.username, /* Object.assign(newUser, createUserDto); */
    email: createUserDto.email,
    password: createUserDto.password,
    hasEmailConfirmed: false,
    role: Role.user,
    tasks: [],
    createdCategories: []
    }
    const user = new this.userModel(newUser);
    return await user.save();
  }

  public async deleteCategory(id: string, idCategory: string): Promise<any> {
    let removedCategory: ICategory;
    const user: IUser = await this.findUserById(id);
    user.createdCategories.forEach(function (category, index) {
      if (category._id === idCategory) {
        removedCategory = user.createdCategories[index];
        user.createdCategories.splice(index, 1);
      }
    });

    if (!removedCategory) {
      return "selected category was not found in user";
    }

    user.tasks.forEach(function (task, index) {
      if (task.categories.includes(removedCategory)) {
        task.categories.splice(index, 1);
      }
    });
    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async deleteReminder(id: string, idTask: string, idReminder: string): Promise<any> {
    const user: IUser = await this.findUserById(id);
    const taskIndex: number = this.findTaskById(user, idTask);
    user.tasks[taskIndex].reminders.forEach(function(reminder,index, reminders){
      if (reminder._id === idReminder) {
        reminders.splice(index, 1);
      }
    })

    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async deleteTask(id: string, idTask: string): Promise<any> {
    /* const user: IUser = await */ 
    this.findUserById(id)
    .then(
      (user) => {
        const taskIndex: number = this.findTaskById(user, idTask);
        
        user.tasks.splice(taskIndex, 1);
        return user;
        }
      ).then(
        (user) => {
          console.log(user);
          return this.userModel.updateOne({ _id: id }, user)
        }
      );

  }

  public async deleteUser(id: string): Promise<any> {
    return await this.userModel.findOneAndDelete(id);
  }

  public async getAllTasks(id: string): Promise<ITask[]> {
    const user = await this.findUserById(id);
    return user.tasks;
  }

  public async getAllCategories(id: string): Promise<ICategory[]> {
    const user = await this.findUserById(id);
    return user.createdCategories;
  }

  public async getAllTasksWithReminder(id: string): Promise<ITask[]> {
    let tasksWithReminder: ITask[];
    const user = await this.findUserById(id);
    user.tasks.forEach(function(task){
      if(task.reminders.length){
        tasksWithReminder.push(task)  
      }
    });
    return tasksWithReminder
  }

  public async getTaskById(id: string, idTask: string): Promise<ITask | any> {
    const user = await this.findUserById(id);
    const taskIndex = this.findTaskById(user, idTask);
    return user.tasks[taskIndex];
  }  

  // public findTaskByDate(id: string, startDate: string, endDate: string): Promise<ITask> {

  // }

  public async findUserByCredentials(username: string, password: string): Promise<IUser> {
    const user = await this.userModel.findOne({username: username}, {password: password});
    if (!user) {
      throw new Error ('user not found');
    }
    return user;
  }


  public async findUserById(id: string): Promise<IUser> {
    return await this.userModel.findById(id);
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    console.log(id);
    console.log(updateUserDto);
    return await this.userModel.findOneAndUpdate({_id: id }, updateUserDto);
    
  }
  
  public async patchTask(id: string, idTask: string, updateTaskDto: UpdateTaskDto): Promise<void> {    
    const user = await this.findUserById(id)
    const taskIndex: number = this.findTaskById(user, idTask);
    user.tasks[taskIndex] = Object.assign(user.tasks[taskIndex], updateTaskDto);
    this.updateUser(id, {tasks:user.tasks});
  }  

  public async putTask(id: string, idTask: string, updateTaskDto: ITask): Promise<void> {
    const user = await this.findUserById(id)
    const taskIndex: number = this.findTaskById(user, idTask);
    user.tasks[taskIndex] = updateTaskDto;
    this.updateUser(id, {tasks:user.tasks});    
  }

  public async getTasksByDate (parameters: {[k: string]: string}) {
    let tasksScheduledInDateRange: ITask[] = [];
    const { startDate, endDate } = parameters;
    const start: number = new Date(startDate).getTime();
    const end: number = new Date(endDate).getTime();

    return this.findUserById(parameters['idUser'])
    .then((user) => {
      return user;
    })
    .then((user) =>  {
      user.tasks.forEach((task) => {
        let taskStartTime = task.startDate.getTime();
        let taskEndTime = task.endDate.getTime();
        if(taskStartTime >= start &&  taskEndTime <= end){
          tasksScheduledInDateRange.push(task);
        }
      });
      return tasksScheduledInDateRange;
    });
    
  }  



  // public validateRegisteredUser(username: string, email: string): Promise<IUser> {

  // }

  // public validateUserCredentials(username: string, password: string): Promise<IUser> {

  // }

  
}
