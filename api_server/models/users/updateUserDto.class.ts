import { ICategory, ITask } from "../tasks/task.interface";

export class UpdateUserDto {
    email?: string;
    password?: string;
    tasks?: ITask[];
    createdCategories?: ICategory[]   
}