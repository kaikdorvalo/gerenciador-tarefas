import { Router } from 'express'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller';

const routes = Router();

routes.post('/users', userController.create);
routes.post('/users/signin', authController.signIn);

export {
    routes
}