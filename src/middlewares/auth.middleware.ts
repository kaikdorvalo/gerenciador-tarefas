import { NextFunction, Request, Response } from "express";
import { Jwt } from "../utils/jwt";
import userModel from '../schema/user.schema';
import { UserRepository } from "../repositories/user.repository";
import { User } from "../interfaces/user.interface";
import { HttpStatus } from "../enums/http-status.enum";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }

    const token = authHeader.split(' ')[1];
    const jwt = new Jwt();

    jwt.verify(token, process.env.JWT_SECRET!, async (err, decode) => {
        if (err) {
            return res.sendStatus(HttpStatus.FORBIDDEN);
        }

        const userId = decode._id;

        if (!userId) {
            return res.sendStatus(HttpStatus.FORBIDDEN);
        }

        const userRepository = new UserRepository(userModel);
        const user: User | null = await userRepository.findById(userId);

        if (user) {
            if (user.canLogin) {
                req.user = { _id: userId };
                next();
            } else {
                res.sendStatus(HttpStatus.UNAUTHORIZED)
            }
        } else {
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    });
};