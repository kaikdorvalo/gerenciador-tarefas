import { NextFunction, Request, Response } from "express";
import { Jwt } from "../utils/jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.sendStatus(401);
        return false;
    }

    const token = authHeader.split(' ')[1];
    const jwt = new Jwt();
    const result = jwt.verify(token);

    if (!result) {
        res.sendStatus(403);
    }

    req.user = { _id: result as string };

    next();
}