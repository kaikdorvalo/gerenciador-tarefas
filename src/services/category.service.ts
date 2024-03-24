import { Request } from "express";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { CategoryRepository } from "../repositories/category.repository";
import categoryModel from '../schema/category.schema';
import { ServiceData } from "../utils/service-data";
import { HttpStatus } from "../enums/http-status.enum";
import { Errors } from "../enums/errors.enum";
import { ValidateFields } from "../utils/validate-fields";
import { Messages } from "../enums/messages.enum";

class CategoryService {
    private readonly repository = new CategoryRepository(categoryModel);
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
            .then(() => {
                return new ServiceData(
                    HttpStatus.OK,
                    Messages.CATEGORY_CREATED_SUCCESSFULLY
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
                return new ServiceData(HttpStatus.INTERNAL_SERVER_ERROR);
            })
    }

    async getCategory(id: string, req: Request) {
        const category = await this.repository.getCategoryById(id);

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
}

export default new CategoryService();