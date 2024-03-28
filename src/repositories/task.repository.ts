import { GenericRepository } from "./generic/generic-repository.repository";
import { Model } from "mongoose";
import { TaskDocument } from "../schema/task.schema";
import { Task } from "../interfaces/task.interface";
import { UpdateTaskDto } from "../dtos/task/update-task.dto";
import { CreateTaskDto } from "../dtos/task/create-task.dto";

export class TaskRepository extends GenericRepository<TaskDocument> {
    constructor(private userModel: Model<TaskDocument>) {
        super(userModel);
    }

    async getTasks(userId: string): Promise<Task[] | null> {
        return this.find({ user: userId, active: true })
            .then((tasks) => {
                return tasks;
            })
            .catch(() => {
                return null;
            })
    }

    async getTaskById(userId: string, id: string): Promise<Task | null> {
        return this.findOne({ user: userId, _id: id })
            .then((task) => {
                return task
            })
            .catch(() => {
                return null;
            })
    }

    async updateTask(updateTask: UpdateTaskDto) {
        return this.updateOne({ _id: updateTask._id }, updateTask)
            .then((result) => {
                if (result.matchedCount !== 0) {
                    return true;
                }
                return false;
            })
    }
}