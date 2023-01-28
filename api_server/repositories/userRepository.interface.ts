import { ICategory, IReminder, ITask } from '../models/tasks/task.interface';
import { CreateUserDto } from '../models/users/createUserDto.class';
import { UpdateUserDto } from '../models/users/updateUserDto.class';
import {IUser} from '../models/users/user.interface'

export interface IUserRepository {
    createCategory(id: string, newCategory: ICategory): any;
    createReminder(id: string, taskId: string, newReminder: IReminder): any;
    createTask(id: string, newTask: ITask): any;
    createUser(createUserDto: CreateUserDto): Promise<IUser>;

    deleteCategory(id: string, idCategory: string): any;
    deleteReminder(id: string, idTask: string, idReminder: string): any;
    deleteTask(id: string, idTask: string): any;
    deleteUser(id: string): any;


    // Hacer busqueda de tareas y categorias por ID
    
    // findTaskByDate(id: string, startDate: string, endDate: string): Promise<ITask>;
    // findTaskById(user: IUser, idTask: string): number
    findUserByCredentials(username: string , password: string): Promise<IUser>;
    findUserById(id: string): Promise<IUser>;    
    getAllTasks(id: string): Promise<ITask[]>;
    getAllCategories(id: string): Promise<ICategory[]>;
    getAllTasksWithReminder(id: string): Promise<ITask[]>;

    updateUser(id: string, updateUserDto: UpdateUserDto ): any;
    // validateRegisteredUser(username: string, email: string): Promise<IUser>;
    // validateUserCredentials(username: string, password: string): Promise<IUser>
}