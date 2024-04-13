export interface Task {
    _id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: string;
    category?: string;
    completed: boolean;
    completedDate?: Date;
    status: string;
    user: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}