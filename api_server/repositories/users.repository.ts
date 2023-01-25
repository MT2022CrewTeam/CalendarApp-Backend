import { IUserRepository } from "./userRepository.interface";
import { MongooseConnection } from "../database";
import { ICategory, IReminder, ITask } from "../models/tasks/task.interface";
import { IUser } from "../models/users/user.interface";
import mongoose, { Model } from "mongoose";
import { Role, UserDocument, userSchema } from "../models/users/user.Schema";
import { CreateUserDto } from "../models/users/createUserDto.class";
import { UpdateUserDto } from "../models/users/updateUserDto.class";

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
      (element) => element === elementToFind
    );
    if (elementExists === -1) {
      return true;
    }
    return false;
  }

  private findTask(
    task: ITask,
    userTasks: ITask[],
    taskComparisonCriteria = ["title", "startDate", "endDate"]
  ): boolean {
    let conditionsFullfilled;
    userTasks.forEach(function (userTask) {
      conditionsFullfilled = 0;
      taskComparisonCriteria.forEach(function (field) {
        if (task[field] === userTask[field]) conditionsFullfilled += 1;
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
    const categoryExists = this.findElementInArray(
      newCategory,
      user.createdCategories
    );
    if (categoryExists) {
      return "Category already exists";
    }
    user.createdCategories.push(newCategory);
    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async createReminder(
    id: string,
    idTask: string,
    newReminder: IReminder
  ) {
    const user: IUser = await this.findUserById(id);
    const taskIndex: number = this.findTaskById(user, idTask);
    if (taskIndex === -1) {
      return "Task was not found";
    }
    user.tasks[taskIndex].reminders.push(newReminder);
    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async createTask(id: string, newTask: ITask) {
    const user = await this.findUserById(id);
    const taskExists = this.findTask(newTask, user.tasks);
    if (taskExists) {
      return "Task already exists";
    }
    user.tasks.push(newTask); //preguntar si se permiten dos tareas con mismo nombre y tiempo
    return await this.userModel.updateOne({ _id: id }, user);

  }

  public async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    let newUser: IUser;
    newUser = Object.assign(newUser, createUserDto);
    newUser.hasEmailConfirmed = false;
    newUser.role = Role.user;
    newUser.tasks = [];
    newUser.createdCategories = [];
    const user = new this.userModel(newUser);
    return await user.save();
  }

  public async deleteCategory(id: string, idCategory: string): Promise<any> {
    let removedCategory: ICategory;
    const user: IUser = await this.findUserById(id);
    user.createdCategories.forEach(function (category, index) {
      if (category._id === idCategory) {
        removedCategory = user.createdCategories[index];
        user.createdCategories.splice(index);
      }
    });

    if (!removedCategory) {
      return "selected category was not found in user";
    }

    user.tasks.forEach(function (task, index) {
      if (task.categories.includes(removedCategory)) {
        task.categories.splice(index);
      }
    });
    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async deleteReminder(id: string, idTask: string, idReminder: string): Promise<any> {
    const user: IUser = await this.findUserById(id);
    const taskIndex: number = this.findTaskById(user, idTask);
    user.tasks[taskIndex].reminders.forEach(function(reminder,index, reminders){
      if (reminder._id === idReminder) {
        reminders.splice(index);
      }
    })

    return await this.userModel.updateOne({ _id: id }, user);
  }

  public async deleteTask(id: string, idTask: string): Promise<any> {
    const user: IUser = await this.findUserById(id);
    user.tasks.forEach(function (task, index) {
      if (task._id === idTask) {
        user.tasks.splice(index);
      }
    });
    return await this.userModel.updateOne({ _id: id }, user);
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

  // public findTaskByDate(id: string, startDate: string, endDate: string): Promise<ITask> {

  // }

  public async findUserByCredentials(username: string, password: string): Promise<IUser> {
    const user = await this.userModel.findOne({username: username}, {password: password});
    if (!user) {
      throw new Error ('user not found');
    }

    return user;
  }

  public findTaskById(user: IUser, idTask: string): number {
    return user.tasks.findIndex(task => task._id === idTask);
  }

  public async findUserById(id: string): Promise<IUser> {
    return await this.userModel.findById(id);
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    return await this.userModel.findOneAndUpdate({_id: id }, updateUserDto);
    
  }

  // public validateRegisteredUser(username: string, email: string): Promise<IUser> {

  // }

  // public validateUserCredentials(username: string, password: string): Promise<IUser> {

  // }
}
