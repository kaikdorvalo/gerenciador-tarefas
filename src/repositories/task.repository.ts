import { GenericRepository } from "./generic/generic-repository.repository";
import { Model } from "mongoose";
import { TaskDocument } from "../schema/task.schema";

export class TaskRepository extends GenericRepository<TaskDocument> {
    constructor(private userModel: Model<TaskDocument>) {
        super(userModel);
    }
}