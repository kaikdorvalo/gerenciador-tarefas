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
routes.get('/tasks/getbyid/:id', authMiddleware, taskController.getTask);
routes.put('/tasks', authMiddleware, taskController.updateTask);
routes.delete('/tasks', authMiddleware, taskController.deleteTask);
routes.get('/tasks/categories/:id', authMiddleware, taskController.getTasksByCategory);
routes.get('/tasks/status/:status', authMiddleware, taskController.getTasksByStatus);
routes.post('/task/period', authMiddleware, taskController.getTasksPerPeriodAndStatus);
routes.get('/tasks/all', authMiddleware, taskController.getUserTaskAmount);
routes.get('/tasks/last', authMiddleware, taskController.getUserLastTask);
routes.post('/categories', authMiddleware, categoryController.create);
routes.put('/categories', authMiddleware, categoryController.updateCategory);
routes.get('/categories', authMiddleware, categoryController.getCatgories);
routes.delete('/categories', authMiddleware, categoryController.deleteCategory);
routes.get('/categories/:id', authMiddleware, categoryController.getCategory);
routes.get('/tasks/endavarage', authMiddleware, taskController.getUserTaskCompletionAvarage);
routes.get('/tasks/highestdescription', authMiddleware, taskController.getTaskWithHighestDescription);
routes.get('/tasks/groupwithcategory', authMiddleware, taskController.getTasksAndGroupByCategory);
routes.get('/tasks/oldest', authMiddleware, taskController.getUserOldestTask);
routes.post('/tasks/complete', authMiddleware, taskController.completeTask);

export {
    routes
}