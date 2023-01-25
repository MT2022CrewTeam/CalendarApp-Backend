import { ICategory, IReminder, ITask } from '../models/tasks/task.interface';
import {IUser} from '../models/users/user.interface'

export interface IUserRepository {
    createCategory(id: string, newCategory: ICategory): any;
    createReminder(id: string, task: ITask, newReminder: IReminder): any;
    createTask(id: string, newTask: ITask): any;
    createUser(createUserDto: IUser): Promise<IUser>;

    // deleteCategory(id: string, categoryName: string): any;
    // deleteReminder(id: string, reminderDate: Date): any;
    // deleteTask(id: string, title: string, startEnd: string): any;
    // deleteUser(id: string): any;

    // findAllTasks(id: string): Promise<ITask[]>;
    // findTaskByDate(id: string, startDate: string, endDate: string): Promise<ITask>;
    // findUserByCredentials(username: string , password: string): Promise<IUser>;
    // findUserById(id: string): Promise<IUser>;    

    // updateUser(id: string, updateUserDto: IUser): void;
    // validateRegisteredUser(username: string, email: string): Promise<IUser>;
    // validateUserCredentials(username: string, password: string): Promise<IUser>
}