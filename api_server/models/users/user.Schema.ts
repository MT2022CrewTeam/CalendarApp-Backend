import mongoose, { Model, Schema } from "mongoose";
import { categorySchema, taskSchema } from "../tasks/task.Schema";

export enum Role {
    user,
    admin
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



