import mongoose, { Document, Model, Schema } from "mongoose";
import { ICategory, ITask } from "../tasks/task.interface";
import { categorySchema, taskSchema } from "../tasks/task.Schema";
import { IUser } from "./user.interface";


export type UserDocument =  User;

export enum Role {
    user,
    admin
}

export class User implements IUser{
    _id?: string;
    fullname: string;
    username: string;
    email: string;
    hasEmailConfirmed: boolean;
    password: string;
    role: Role;
    tasks: ITask[];
    createdCategories: ICategory[]   
}

export const userSchema = new Schema ({
    fullname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    email: {
            type: String,
            required: true
    },
    
    password: {
        type: String,
        required: true
    },    

    hasEmailConfirmed: Boolean,
    role: {
        type: String,
        enum: Role,
        default: Role.user,
        required: false
    },

    tasks: [taskSchema],
    createdCategories: [categorySchema]
})

export const userModel = mongoose.model('user', userSchema, 'Users');



