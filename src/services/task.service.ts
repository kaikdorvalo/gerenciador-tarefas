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
import { Request } from 'express';
import { UpdateTaskDto } from '../dtos/task/update-task.dto';
import { FormatFields } from '../utils/format-fields';

class TaskService {
    private readonly repository = new TaskRepository(taskModel);
    private readonly categoryRepository = new CategoryRepository(categoryModel)
    private validateFields = new ValidateFields();
    private formatFields = new FormatFields();

    private validateStartAndEndDate(startDate: string, endDate: string) {
        if (this.validateFields.validateDate(startDate) && this.validateFields.validateDate(endDate)) {
            if (startDate < endDate) {
                return true;
            }
        }
        return false;
    }

    async create(createTask: CreateTaskDto, req: Request) {

        if (this.validateStartAndEndDate(this.formatFields.dateToString(createTask.startDate), this.formatFields.dateToString(createTask.endDate))) {
            return new ServiceData(HttpStatus.BAD_REQUEST, Errors.START_DATE_AND_END_DATE);
        }

        if (createTask.category) {
            const category = await this.categoryRepository.findCategoryById(req.user._id, createTask.category);
            if (category) {
                if (!category.active) {
                    return new ServiceData(
                        HttpStatus.NOT_FOUND,
                        Errors.CATEGORY_NOT_FOUND
                    )
                }
            } else {
                return new ServiceData(
                    HttpStatus.NOT_FOUND,
                    Errors.CATEGORY_NOT_FOUND
                )
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
        const task = await this.repository.getTaskById(req.user._id, id);

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

    // 100% funcional
    async updateTask(userId: string, updateTask: UpdateTaskDto) {
        if (updateTask._id) {
            if (updateTask.title?.length == 0) {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.INVALID_TASK_TITLE
                )
            }
            if (updateTask.description?.length == 0) {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.INVALID_TASK_DESCRIPTION
                )
            }
            if (updateTask.category) {
                if (await this.categoryRepository.findCategoryById(userId, updateTask.category) == null) {
                    return new ServiceData(
                        HttpStatus.BAD_REQUEST,
                        Errors.INVALID_TASK_CATEGORY
                    )
                }
            }
            if (updateTask.status) {
                if (!this.validateFields.validateStatus(updateTask.status)) {
                    return new ServiceData(
                        HttpStatus.BAD_REQUEST,
                        Errors.INVALID_TASK_STATUS
                    )
                }
            }

            const task = await this.repository.getTaskById(userId, updateTask._id);
            if (task) {
                if (!task.active) {
                    return new ServiceData(
                        HttpStatus.NOT_FOUND
                    )
                }

                if (updateTask.startDate && updateTask.endDate === undefined) {
                    if (!this.validateStartAndEndDate(updateTask.startDate, this.formatFields.dateToString(task.endDate))) {
                        return new ServiceData(
                            HttpStatus.BAD_REQUEST,
                            Errors.START_DATE_AND_END_DATE
                        )
                    }
                }

                if (updateTask.startDate === undefined && updateTask.endDate) {
                    if (!this.validateStartAndEndDate(this.formatFields.dateToString(task.startDate), updateTask.endDate)) {
                        return new ServiceData(
                            HttpStatus.BAD_REQUEST,
                            Errors.START_DATE_AND_END_DATE
                        )
                    }
                }

                return await this.repository.updateTask(updateTask)
                    .then(() => {
                        return new ServiceData(
                            HttpStatus.OK,
                            Messages.TASK_UPDATED
                        )
                    })
                    .catch(() => {
                        return new ServiceData(HttpStatus.INTERNAL_SERVER_ERROR)
                    })
            }
            return new ServiceData(
                HttpStatus.BAD_REQUEST,
                Errors.TASK_NOT_FOUND
            )
        }

        return new ServiceData(
            HttpStatus.BAD_REQUEST,
            Errors.TASK_NOT_FOUND
        )
    }

}

export default new TaskService();