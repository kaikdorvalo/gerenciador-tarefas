import { GenericRepository } from "./generic/generic-repository.repository";
import { Model } from "mongoose";
import { CategoryDocument } from "../schema/category.schema";
import { Category } from "../interfaces/category.interface";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";

export class CategoryRepository extends GenericRepository<CategoryDocument> {
    constructor(private userModel: Model<CategoryDocument>) {
        super(userModel);
    }

    async getCategories(userId: string): Promise<Category[] | null> {
        return this.find({ user: userId, active: true })
            .then((categories) => {
                return categories;
            })
            .catch(() => {
                return null;
            })
    }

    async findCategoryById(userId: string, _id: string): Promise<Category | null> {
        return this.findOne({ _id: _id, active: true, user: userId })
            .then((category) => {
                return category;
            })
            .catch(() => {
                return null;
            })
    }

    async findCategoryByName(name: string, userId: string): Promise<Category | null> {
        return this.findOne({ user: userId, name: name, active: true })
            .then((category) => {
                return category;
            })
            .catch(() => {
                return null;
            })
    }

    async updateCategory(userId: string, updateCategory: UpdateCategoryDto): Promise<boolean> {
        return this.updateOne({ user: userId, _id: updateCategory._id }, updateCategory)
            .then((result) => {
                if (result.matchedCount !== 0) {
                    return true;
                }
                return false;
            })
            .catch(() => {
                return false;
            })
    }

    async desactiveCategory(id: string) {
        return this.updateOne({ _id: id }, { active: false })
            .then((result) => {
                if (result.matchedCount !== 0) {
                    return true;
                }
                return false
            })
            .catch(() => {
                return false;
            })
    }
}