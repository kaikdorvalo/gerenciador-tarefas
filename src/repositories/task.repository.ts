import { GenericRepository } from "./generic/generic-repository.repository";
import { Model } from "mongoose";
import { TaskDocument } from "../schema/task.schema";
import { Task } from "../interfaces/task.interface";

export class TaskRepository extends GenericRepository<TaskDocument> {
    constructor(private userModel: Model<TaskDocument>) {
        super(userModel);
    }

    async getTasks(userId: string): Promise<Task[] | null> {
        return this.find({ user: userId })
            .then((tasks) => {
                return tasks;
            })
            .catch(() => {
                return null;
            })
    }

    async getTaskById(id: string): Promise<Task | null> {
        return this.findById(id)
            .then((task) => {
                return task
            })
            .catch(() => {
                return null;
            })
    }
}