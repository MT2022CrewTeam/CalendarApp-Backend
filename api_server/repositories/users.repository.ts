import { IUserRepository } from "./userRepository.interface";
import { MongooseConnection } from "../database";
import { ICategory, IReminder, ITask } from "../models/tasks/task.interface";
import { IUser } from "../models/users/user.interface";
import mongoose, { Model } from "mongoose";
import { userSchema } from "../models/users/user.Schema";


export class UserRepository implements IUserRepository{

        readonly User;
        

    constructor (private connection: MongooseConnection) {
        this.User = this.connection.mongoose.model('user', userSchema, 'Users');
    }

    private findElementInArray(elementToFind: any, array: any[]): boolean{
      const elementExists = array
       .findIndex(element => element === elementToFind);
     if (elementExists  === -1) {
       return true;
     }
     return false;
    }    

    private findTask(
                     task: ITask, 
                     userTasks: ITask[],
                     taskComparisonCriteria = ['title', 'startDate', 'endDate']
                     ): boolean {

      let conditionsFullfilled = 0;
      userTasks.forEach(function(taskInList){
          for (let field in taskComparisonCriteria) {
            if (task[field] === taskInList[field]) {
              conditionsFullfilled += 1;
            }
          }
      });
      if (conditionsFullfilled === taskComparisonCriteria.length) {
        return true;
      }
      return false;
    };
        

    public async createCategory (id: string, newCategory: ICategory): Promise<any> {
      const user: IUser = await this.findUserById(id);/* await this.User.findOne({"_id": id}); */
      const categoryExists = this.findElementInArray(
        newCategory, user.createdCategories);
      if (categoryExists) {
        return 'Category already exists';
      }
      user.createdCategories.push(newCategory);
      return await this.User.updateOne({"_id": id}, user);
    }

    public async createReminder(id: string, 
                                selectedTask: ITask, newReminder: IReminder) {
      const user: IUser = await this.findUserById(id);
      const reminderExists = this.findElementInArray(
        newReminder, user.createdCategories);
      if (reminderExists) {
        return 'Reminder already exists';
      }
      const taskPosition = user.tasks.findIndex(task => task === selectedTask);
      if (taskPosition === -1) {
        return 'Task was not found';
      }

      user.tasks[taskPosition].reminders.push(newReminder);
      return await this.User.updateOne({"_id": id}, user);      
    }

    public async createTask(id: string, newTask: ITask) {
      const user: IUser = await this.findUserById(id);
      const taskExists = this.findTask(
        newTask, user.tasks);
      if (taskExists) {
        return 'Task already exists';
      }      
      user.tasks.push(newTask);//preguntar si se permiten dos tareas con mismo nombre y tiempo
      return await this.User.updateOne({"_id": id}, user);
    }

    public async createUser(createUserDto: IUser): Promise<IUser> {
      const user = new this.User(createUserDto);
      return await user.save();
    }

    // public deleteCategory(id: string, categoryName: string) {
        
    // }

    // public deleteReminder(id: string, reminderDate: Date) {
        
    // }

    // public deleteTask(id: string, title: string, startEnd: string) {
        
    // }

    // public deleteUser(id: string) {
        
    // }

    // public findAllTasks(id: string): Promise<ITask[]> {
        
    // }

    // public findTaskByDate(id: string, startDate: string, endDate: string): Promise<ITask> {
        
    // }

    // public findUserByCredentials(username: string, password: string): Promise<IUser> {
        
    // }

    public async findUserById(id: string): Promise<IUser> {
        return await this.User.findById(id);
        
    }

    // public updateUser(id: string, updateUserDto: IUser): void {
        
    // }

    // public validateRegisteredUser(username: string, email: string): Promise<IUser> {
        
    // }

    // public validateUserCredentials(username: string, password: string): Promise<IUser> {
        
    // }





}