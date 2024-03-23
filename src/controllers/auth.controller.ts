import { Request, Response } from 'express';
import authService from '../services/auth.service';


class AuthController {
    async signIn(req: Request, res: Response) {
        const result = await authService.signIn(req.body, res);
        return res.status(result.statusCode).send(result.metaData);
    }
}

export default new AuthController();