import { taskStatus } from "./task.Schema";


export interface ICategory {
    name: string;
    color: string
}

export interface IReminder {
    date: Date;
    message: string
}


export interface ITask {
    title: string;
    startDate: Date;
    endDate: Date;
    status: taskStatus;
    progress: Number;
    categories: ICategory[];
    reminders: IReminder[]
}