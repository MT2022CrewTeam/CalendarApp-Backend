import { ICategory, ITask } from "../tasks/task.interface"


enum Role {
    user,
    admin
}


export interface IUser {
    fullname: String,
    username: String,
    email: String,
    hasEmailConfirmed: Boolean,
    password: String,
    role: Role,
    tasks: ITask[],
    createdCategories: ICategory[]    
}