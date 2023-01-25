import { ICategory, ITask } from "../tasks/task.interface"


enum Role {
    user,
    admin
}


export interface IUser {
    _id?: string,
    fullname: string,
    username: string,
    email: string,
    hasEmailConfirmed: boolean,
    password: string,
    role: Role,
    tasks: ITask[],
    createdCategories: ICategory[]    
}