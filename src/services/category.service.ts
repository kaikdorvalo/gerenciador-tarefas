import { Request } from "express";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { CategoryRepository } from "../repositories/category.repository";
import categoryModel from '../schema/category.schema';
import { ServiceData } from "../utils/service-data";
import { HttpStatus } from "../enums/http-status.enum";
import { Errors } from "../enums/errors.enum";
import { ValidateFields } from "../utils/validate-fields";
import { Messages } from "../enums/messages.enum";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";
import { DeleteCategoryDto } from "../dtos/category/delete-category.dto";
import { TaskRepository } from "../repositories/task.repository";
import taskModel from '../schema/task.schema';

class CategoryService {
    private readonly repository = new CategoryRepository(categoryModel);
    private readonly taskRepository = new TaskRepository(taskModel)
    private validateFields = new ValidateFields();

    async create(createCategory: CreateCategoryDto, req: Request) {
        if (await this.repository.findCategoryByName(createCategory.name, req.user._id) !== null) {
            return new ServiceData(HttpStatus.BAD_REQUEST, Errors.CATEGORY_NAME_ALREADY_EXISTS);
        }

        if (!this.validateFields.validateHexColor(createCategory.color)) {
            return new ServiceData(HttpStatus.BAD_REQUEST, Errors.CATEGORY_HEXADECIMAL_COLOR);
        }

        if (this.validateFields.validateEmptyString(createCategory.name)) {
            return new ServiceData(HttpStatus.BAD_REQUEST, Errors.EMPTY_CATEGORY_NAME);
        }

        createCategory.user = req.user._id;
        createCategory.active = true;

        return this.repository.create(createCategory)
            .then((res) => {
                return new ServiceData(
                    HttpStatus.OK,
                    Messages.CATEGORY_CREATED_SUCCESSFULLY,
                    res
                )
            })
            .catch(() => {
                return new ServiceData(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Errors.CREATE_CATEGORY_ERROR
                )
            })
    }

    async getCategories(req: Request) {
        return this.repository.getCategories(req.user._id)
            .then((categories) => {
                return new ServiceData(
                    HttpStatus.OK,
                    Messages.ALL_USER_CATEGORIES,
                    categories
                )
            })
            .catch(() => {
                return new ServiceData(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    Errors.INTERNAL_SERVER_ERROR
                );
            })
    }

    async getCategory(id: string, req: Request) {
        const category = await this.repository.findCategoryById(req.user._id, id);

        if (category) {
            if (category.user !== req.user._id) {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.CATEGORY_NOT_FOUND
                )
            }

            return new ServiceData(
                HttpStatus.OK,
                Messages.CATEGORY_FOUND,
                category
            )
        }

        return new ServiceData(
            HttpStatus.BAD_REQUEST,
            Errors.CATEGORY_NOT_FOUND
        )
    }

    async updateCategory(userId: string, updateCategory: UpdateCategoryDto) {
        if (updateCategory._id) {
            if (updateCategory.name?.length === 0) {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.EMPTY_CATEGORY_NAME
                )
            }
            if (updateCategory.color) {
                if (!this.validateFields.validateHexColor(updateCategory.color)) {
                    return new ServiceData(
                        HttpStatus.BAD_REQUEST,
                        Errors.CATEGORY_HEXADECIMAL_COLOR
                    )
                }
            }

            return await this.repository.updateCategory(userId, updateCategory)
                .then((result) => {
                    if (result) {
                        return new ServiceData(
                            HttpStatus.OK,
                            Messages.CATEGORY_UPDATE_SUCCESSFULLY
                        )
                    }
                    return new ServiceData(
                        HttpStatus.BAD_REQUEST,
                        Errors.CANNOT_UPDATE_CATEGORY
                    );
                })
                .catch(() => {
                    return new ServiceData(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        Errors.INTERNAL_SERVER_ERROR
                    );
                })
        }
        return new ServiceData(
            HttpStatus.NOT_FOUND,
            Errors.CATEGORY_NOT_FOUND
        )
    }

    async deleteCategory(userId: string, deleteCategory: DeleteCategoryDto) {
        const [category, inUse] = await Promise.all([
            this.repository.findCategoryById(userId, deleteCategory._id),
            this.taskRepository.count({ category: deleteCategory._id, active: true })
        ]);
        if (category) {
            if (inUse > 0) {
                return new ServiceData(
                    HttpStatus.CONFLICT,
                    Errors.CATEGORY_IN_USE
                )
            }

            return this.repository.desactiveCategory(deleteCategory._id)
                .then((result) => {
                    if (result) {
                        return new ServiceData(
                            HttpStatus.OK,
                            Messages.CATEGORY_DELETE_SUCCESSFULLY
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


}

export default new CategoryService();