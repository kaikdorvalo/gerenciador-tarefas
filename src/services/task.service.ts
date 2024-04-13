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
import { DeleteTaskDto } from '../dtos/task/delete-task.dto';
import { Task } from '../interfaces/task.interface';
import { TaskPeriodAndStatusDto } from '../dtos/task/task-period';
import { CategoryGroupTask } from '../classes/CategoryGroupTask';

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
        createTask.completed = false;

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

    async deleteTask(userId: string, deleteTask: DeleteTaskDto) {
        const task = await this.repository.getTaskById(userId, deleteTask._id);
        if (task) {
            this.repository.desactiveTask(task._id)
                .then((result) => {
                    if (result) {
                        return new ServiceData(
                            HttpStatus.OK,
                            Messages.TASK_DELETE_SUCCESSFULLY
                        )
                    }
                    return new ServiceData(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        Errors.INTERNAL_SERVER_ERROR
                    )
                })
                .catch(() => {
                    return new ServiceData(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        Errors.INTERNAL_SERVER_ERROR
                    )
                })
        }
        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.CATEGORY_NOT_FOUND
        )
    }

    async getTasksByCategory(userId: string, categoryId: string) {
        const tasks = await this.repository.getTasks(userId);
        let filter: (Task | undefined)[];
        if (tasks) {
            filter = tasks.filter((el) => el.category === categoryId);

            return new ServiceData(
                HttpStatus.OK,
                Messages.TASKS_FOUND,
                filter
            )
        }

        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.TASKS_NOT_FOUND
        )
    }

    async getTasksByStatus(userId: string, status: string) {
        const tasks = await this.repository.getTasks(userId);
        let filter: (Task | undefined)[];
        if (tasks) {
            filter = tasks.filter((el) => el.status === status);

            return new ServiceData(
                HttpStatus.OK,
                Messages.TASKS_FOUND,
                filter
            )
        }

        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.TASKS_NOT_FOUND
        )
    }

    async getTasksPerPeriodAndStatus(userId: string, periodAndStatus: TaskPeriodAndStatusDto) {
        if (!this.validateStartAndEndDate(periodAndStatus.startDate, periodAndStatus.endDate)) {
            return new ServiceData(
                HttpStatus.BAD_REQUEST,
                Errors.START_DATE_AND_END_DATE
            )
        }

        const tasks = await this.repository.getTasks(userId);
        let filter: (Task | undefined)[];

        if (tasks) {
            if (periodAndStatus.status) {
                filter = tasks.filter((el) => el.endDate >= new Date(periodAndStatus.startDate)
                    && el.endDate <= new Date(periodAndStatus.endDate)
                    && el.status == periodAndStatus.status
                )

                return new ServiceData(
                    HttpStatus.OK,
                    Messages.TASKS_FOUND,
                    filter
                )
            }
            filter = tasks.filter((el) => el.endDate >= new Date(periodAndStatus.startDate)
                && el.endDate <= new Date(periodAndStatus.endDate)
            )

            return new ServiceData(
                HttpStatus.OK,
                Messages.TASKS_FOUND,
                filter
            )
        }

        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.TASKS_NOT_FOUND
        )
    }

    async getUserTaskAmount(userId: string) {
        const tasks = await this.repository.findAllTasks();
        let userTaskAmount = 0;
        if (tasks) {
            tasks.forEach((el) => {
                if (el.user === userId) {
                    userTaskAmount++;
                }
            })
        }

        return new ServiceData(
            HttpStatus.OK,
            Messages.USER_TASK_AMOUNT,
            userTaskAmount
        )

    }

    async getUserLastTask(userId: string) {
        const tasks = await this.repository.getTasks(userId);
        if (tasks) {
            let last = tasks[0];
            tasks.forEach((el) => {
                if (el.createdAt! > last.createdAt!) {
                    last = el;
                }
            })

            return new ServiceData(
                HttpStatus.OK,
                Messages.USER_LAST_TASK,
                last
            )
        }

        return new ServiceData(
            HttpStatus.NOT_FOUND
        )
    }

    async getUserTaskCompletionAvarage(userId: string) {
        const tasks = await this.repository.getTasks(userId);
        let tasksDays: number[] = new Array();
        let days = 0;
        if (tasks) {
            tasks.forEach((task) => {
                if (task.completed) {
                    const startDate = task.startDate;
                    const endDate = task.endDate;
                    const diff = Math.abs(endDate.getTime() - startDate.getTime());
                    const days = Math.ceil(diff / (1000 * 60 * 24));
                    tasksDays.push(days);
                }

            })

            if (tasksDays.length > 0) {
                tasksDays.forEach((day) => {
                    days += day;
                })

                let avarage = days / tasksDays.length;

                return new ServiceData(
                    HttpStatus.OK,
                    Messages.USER_TASKS_COMPLETION_AVARAGE,
                    avarage
                )
            }

        }

        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.TASKS_NOT_FOUND
        )
    }

    async getTaskWithHighestDescription(userId: string) {
        const tasks = await this.repository.getTasks(userId);
        let highest = 0;
        let highestTask: Task | null = null;
        if (tasks) {
            tasks.forEach((task) => {
                if (task.description.length > highest) {
                    highest = task.description.length;
                    highestTask = task;
                }
            });

            return new ServiceData(
                HttpStatus.OK,
                Messages.TASK_WITH_HIGHEST_DESCRIPTION,
                highestTask
            )
        }

        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.TASKS_NOT_FOUND
        )
    }

    async getTasksAndGroupByCategory(userId: string) {
        try {
            const [categories, tasks] = await Promise.all([
                this.categoryRepository.getCategories(userId),
                this.repository.getTasks(userId),
            ]);

            const group: CategoryGroupTask[] = new Array();

            if (categories) {
                if (tasks) {
                    categories.forEach((category) => {
                        let tasksArray = tasks.map((task) => {
                            if (task.category === category._id) {
                                return task;
                            }
                            return null
                        });
                        const categoryGroupTask = new CategoryGroupTask(category, tasksArray);
                        group.push(categoryGroupTask);
                    });

                    return new ServiceData(
                        HttpStatus.OK,
                        Messages.TASKS_GROUPED_BY_CATEGORY,
                        group
                    )

                }
                return new ServiceData(
                    HttpStatus.NOT_FOUND,
                    Errors.TASKS_NOT_FOUND
                )
            }

            return new ServiceData(
                HttpStatus.NOT_FOUND,
                Errors.CATEGORIES_NOT_FOUND
            )
        } catch (error) {
            return new ServiceData(
                HttpStatus.NOT_FOUND,
                Errors.CATEGORIES_NOT_FOUND
            )
        }
    }
}


export default new TaskService();