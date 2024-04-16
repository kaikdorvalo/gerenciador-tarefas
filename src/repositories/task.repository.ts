import { GenericRepository } from "./generic/generic-repository.repository";
import { FilterQuery, Model } from "mongoose";
import { TaskDocument } from "../schema/task.schema";
import { Task } from "../interfaces/task.interface";
import { UpdateTaskDto } from "../dtos/task/update-task.dto";
import { CreateTaskDto } from "../dtos/task/create-task.dto";
import { ChangeTaskStatus } from "../dtos/task/complete-task.dto";
import { TaskStatus } from "../enums/task-status.enum";

export class TaskRepository extends GenericRepository<TaskDocument> {
    constructor(private userModel: Model<TaskDocument>) {
        super(userModel);
    }

    async findAllTasks(): Promise<Task[] | null> {
        return this.find({ active: true })
            .then((tasks) => {
                return tasks
            })
            .catch(() => {
                return null;
            })
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
        return this.findOne({ user: userId, _id: id, active: true })
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
            .catch(() => {
                return false;
            })
    }

    async desactiveTask(id: string) {
        return this.updateOne({ _id: id }, { active: false })
            .then((result) => {
                if (result.matchedCount !== 0) {
                    return true;
                }
                return false
            })
            .catch(() => {
                return false;
            })
    }

    async setTaskStatus(changeTaskStatus: ChangeTaskStatus) {
        if (changeTaskStatus.status == TaskStatus.COMPLETED) {
            changeTaskStatus.completedDate = new Date();
            return this.updateOne({ _id: changeTaskStatus._id }, { status: changeTaskStatus.status, completedDate: changeTaskStatus.completedDate })
                .then((res) => {
                    if (res.matchedCount >= 1) {
                        return { action: changeTaskStatus.status, result: true };
                    }
                    return { action: changeTaskStatus.status, result: false }
                })
                .catch(() => {
                    return { action: changeTaskStatus.status, result: false }
                })
        } else {
            return this.updateOne({ _id: changeTaskStatus._id }, { status: changeTaskStatus.status, completedDate: null })
                .then((res) => {
                    if (res.matchedCount >= 1) {
                        return { action: changeTaskStatus.status, result: true };
                    }
                    return { action: changeTaskStatus.status, result: false }
                })
                .catch(() => {
                    return { action: changeTaskStatus.status, result: false }
                })
        }
    }
}