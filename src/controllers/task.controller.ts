import { Request, Response } from 'express';
import taskService from '../services/task.service';

class TaskController {
    async create(req: Request, res: Response) {
        const result = await taskService.create(req.body, req);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTasks(req: Request, res: Response) {
        const result = await taskService.getTasks(req);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTask(req: Request, res: Response) {
        const { id } = req.params;
        const result = await taskService.getTask(id, req);
        return res.status(result.statusCode).send(result.metaData);
    }
}

export default new TaskController();