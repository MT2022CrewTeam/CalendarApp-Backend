import { taskStatus } from "./task.Schema";


export interface ICategory {
    _id?: string;
    name: string;
    color: string
}

export interface IReminder {
    _id?: string,
    date: Date;
    message: string
}


export interface ITask {
    _id?: string;
    title: string;
    startDate: Date;
    endDate: Date;
    status: taskStatus;
    progress: Number;
    categories: ICategory[];
    reminders: IReminder[]
}