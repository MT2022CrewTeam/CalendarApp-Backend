import { ICategory, IReminder } from "./task.interface";
import { taskStatus } from "./task.Schema";

export class UpdateTaskDto {
    title?: string;
    startDate?: Date;
    endDate?: Date;
    status?: taskStatus;
    progress?: Number;
    categories?: ICategory[];
    reminders?: IReminder[]
}
