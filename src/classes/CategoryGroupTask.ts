import { Category } from "../interfaces/category.interface";
import { Task } from "../interfaces/task.interface";

export class CategoryGroupTask {
    public category: Category;
    public tasks: Task[];

    constructor(category: Category, tasks: Task[]) {
        this.category = category;
        this.tasks = tasks;
    }
}