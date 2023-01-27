import { ICategory, ITask } from "../tasks/task.interface";

export class UpdateUserDto {
    fullname?: string;
    email?: string;
    password?: string;
    hasEmailConfirmed?: boolean;
    tasks?: ITask[];
    createdCategories?: ICategory[]   
}