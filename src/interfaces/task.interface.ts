export interface Task {
    _id?: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: string;
    category?: string;
    status: string;
    user: string;
    createdAt?: Date;
    updatedAt?: Date;
}