export class CreateTaskDto {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: string;
    category?: string;
    completed?: boolean;
    status?: string;
    user?: string;
    active?: boolean;
}