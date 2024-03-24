import { CreateTaskDto } from '../dtos/task/create-task.dto';
import { Errors } from '../enums/errors.enum';
import { HttpStatus } from '../enums/http-status.enum';
import { CategoryRepository } from '../repositories/category.repository';
import { TaskRepository } from '../repositories/task.repository'
import taskModel from '../schema/task.schema'
import categoryModel from '../schema/category.schema';
import { ServiceData } from '../utils/service-data';
import { ValidateFields } from '../utils/validate-fields';
import { Messages } from '../enums/messages.enum';
import { Category } from '../interfaces/category.interface';
import { Request } from 'express';

class TaskService {
    private readonly repository = new TaskRepository(taskModel);
    private readonly categoryRepository = new CategoryRepository(categoryModel)
    private validateFields = new ValidateFields();

    async create(createTask: CreateTaskDto, req: Request) {

        if (createTask.startDate > createTask.endDate) {
            return new ServiceData(HttpStatus.BAD_REQUEST, Errors.START_DATE_AND_END_DATE);
        }

        if (createTask.category) {
            const category = await this.categoryRepository.findCategoryById(createTask.category);
            if (category == null) {
                return new ServiceData(HttpStatus.BAD_REQUEST, Errors.INVALID_TASK_CATEGORY);
            }

            if (category.user != req.user._id) {
                return new ServiceData(HttpStatus.BAD_REQUEST, Errors.INVALID_USER_CATEGORY);
            }

        }

        createTask.status = 'pending';
        createTask.user = req.user._id;
        createTask.active = true;

        return this.repository.create(createTask)
            .then(() => {
                return new ServiceData(
                    HttpStatus.OK,
                    Messages.TASK_CREATED_SUCCESSFULLY
                )
            })
            .catch(() => {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.MISSING_TASK_INFORMATIONS
                )
            })

    }

    async getTasks(req: Request) {
        return this.repository.getTasks(req.user._id)
            .then((tasks) => {
                return new ServiceData(
                    HttpStatus.OK,
                    Messages.ALL_USER_TASKS,
                    tasks
                )
            })
            .catch(() => {
                return new ServiceData(
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            })

    }

    async getTask(id: string, req: Request) {
        const task = await this.repository.getTaskById(id);

        if (task) {
            if (task.user !== req.user._id) {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.TASK_NOT_FOUND
                )
            }

            return new ServiceData(
                HttpStatus.OK,
                Messages.TASK_FOUND,
                task
            )
        }

        return new ServiceData(
            HttpStatus.BAD_REQUEST,
            Errors.TASK_NOT_FOUND
        )

    }

}

export default new TaskService();