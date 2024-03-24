import { Request, Response, response } from 'express';
import userService from '../services/user.service'


class UserController {
    async create(req: Request, res: Response) {
        const result = await userService.create(req.body);
        return res.status(result.statusCode).send(result.metaData);
    }
}

export default new UserController();