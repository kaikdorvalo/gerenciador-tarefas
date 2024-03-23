import { TaskRepository } from '../repositories/task.repository'
import taskModel from '../schema/task.schema'

class TaskService {
    private readonly repository = new TaskRepository(taskModel);
}

export default new TaskService();