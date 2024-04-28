export class TaskPeriodAndStatusDto {
    startDate: Date;
    endDate: Date;
    status?: string;

    constructor(startDate: Date, endDate: Date, status: string) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}