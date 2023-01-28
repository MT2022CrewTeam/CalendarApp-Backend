import { ICategory, IReminder } from "./task.interface";
import { taskStatus } from "./task.Schema";


export class CreateTaskDto {
    title: string;
    startDate: Date;
    endDate: Date;
    categories?: ICategory[];
    reminders?: IReminder[]    
} 