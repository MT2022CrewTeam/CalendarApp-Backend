import mongoose, { Document, Schema } from "mongoose";
import { ICategory, IReminder, ITask } from "./task.interface";


export type taskDocument = ITask & Document; 
export type categoryDocument = ICategory & Document; 
export type reminderDocument = IReminder & Document; 

export enum taskStatus {
    completed,
    scheduled,
    in_progress,
    edited
}

export const categorySchema = new Schema ({
    name: String,
    color: String
});

export const reminderSchema = new Schema({
    date: Date,
    message: String
});

export const taskSchema = new Schema ({
    title: {
        type: String,
        required: true
    },

    
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: taskStatus,
        default: taskStatus.in_progress
    },
    progress: Number,
    description: String,
    categories: [categorySchema],/* [{name: String, color: String }], */
    reminders: [reminderSchema]/* [{date: Date, message: String}] */
})


// export const taskModel = mongoose.model('task')