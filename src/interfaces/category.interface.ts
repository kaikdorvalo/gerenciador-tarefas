export interface Category {
    _id: string;
    name: string;
    color: string;
    user: string;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}