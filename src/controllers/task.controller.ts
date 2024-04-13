import { Request, Response } from 'express';
import taskService from '../services/task.service';
import { HttpStatus } from '../enums/http-status.enum';

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

    async updateTask(req: Request, res: Response) {
        const result = await taskService.updateTask(req.user._id, req.body);
        return res.status(result.statusCode).send(result.metaData);
    }

    async deleteTask(req: Request, res: Response) {
        const result = await taskService.deleteTask(req.user._id, req.body);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTasksByCategory(req: Request, res: Response) {
        const { id } = req.params;
        const result = await taskService.getTasksByCategory(req.user._id, id);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTasksByStatus(req: Request, res: Response) {
        const { status } = req.params;
        const result = await taskService.getTasksByStatus(req.user._id, status);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTasksPerPeriodAndStatus(req: Request, res: Response) {
        const result = await taskService.getTasksPerPeriodAndStatus(req.user._id, req.body);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getUserTaskAmount(req: Request, res: Response) {
        const result = await taskService.getUserTaskAmount(req.user._id);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getUserLastTask(req: Request, res: Response) {
        console.log('entrou controller')
        const result = await taskService.getUserLastTask(req.user._id);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getUserTaskCompletionAvarage(req: Request, res: Response) {
        const result = await taskService.getUserTaskCompletionAvarage(req.user._id);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTaskWithHighestDescription(req: Request, res: Response) {
        const result = await taskService.getTaskWithHighestDescription(req.user._id);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getTasksAndGroupByCategory(req: Request, res: Response) {
        const result = await taskService.getTasksAndGroupByCategory(req.user._id);
        return res.status(result.statusCode).send(result.metaData);
    }
}

export default new TaskController();