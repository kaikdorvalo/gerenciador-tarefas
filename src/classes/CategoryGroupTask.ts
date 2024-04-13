import { Category } from "../interfaces/category.interface";
import { Task } from "../interfaces/task.interface";

export class CategoryGroupTask {
    public category: Category;
    public tasks: (Task | null)[];

    constructor(category: Category, tasks: (Task | null)[]) {
        this.category = category;
        this.tasks = tasks;
    }
}