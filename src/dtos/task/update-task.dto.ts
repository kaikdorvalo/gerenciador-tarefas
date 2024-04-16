export class UpdateTaskDto {
    _id: string;
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    type?: string;
    category?: string;
    status?: string;
}