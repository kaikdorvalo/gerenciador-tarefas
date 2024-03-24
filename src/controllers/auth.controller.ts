import { Request, Response } from 'express';
import authService from '../services/auth.service';


class AuthController {
    async signIn(req: Request, res: Response) {
        const result = await authService.signIn(req.body, res);
        return res.status(result.statusCode).send(result.metaData);
    }

    async renewToken(req: Request, res: Response) {
        return await authService.renewToken(req, res);
    }
}

export default new AuthController();