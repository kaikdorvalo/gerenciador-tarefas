import { Router } from 'express'
import userController from '../controllers/user.controller'
import authController from '../controllers/auth.controller';
import categoryController from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import taskController from '../controllers/task.controller';

const routes = Router();

routes.post('/users', userController.create);
routes.post('/users/signin', authController.signIn);
routes.get('/users/refreshtoken', authController.renewToken);
routes.post('/tasks', authMiddleware, taskController.create);
routes.get('/tasks', authMiddleware, taskController.getTasks);
routes.get('/tasks/:id', authMiddleware, taskController.getTask);
routes.post('/categories', authMiddleware, categoryController.create);
routes.get('/categories', authMiddleware, categoryController.getCatgories);
routes.get('/categories/:id', authMiddleware, categoryController.getCategory);

export {
    routes
}