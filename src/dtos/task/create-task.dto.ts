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

    constructor(title: string, description: string, startDate: Date, endDate: Date, type: string) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
    }
}