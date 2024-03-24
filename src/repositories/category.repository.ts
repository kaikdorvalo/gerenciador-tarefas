import { GenericRepository } from "./generic/generic-repository.repository";
import { Model } from "mongoose";
import { CategoryDocument } from "../schema/category.schema";
import { Category } from "../interfaces/category.interface";

export class CategoryRepository extends GenericRepository<CategoryDocument> {
    constructor(private userModel: Model<CategoryDocument>) {
        super(userModel);
    }

    async getCategories(userId: string): Promise<Category[] | null> {
        return this.find({ user: userId })
            .then((categories) => {
                return categories;
            })
            .catch(() => {
                return null;
            })
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return this.findOne({ _id: id })
            .then((category) => {
                return category;
            })
            .catch(() => {
                return null;
            })
    }

    async findCategoryById(_id: string): Promise<Category | null> {
        return this.findOne({ _id: _id })
            .then((category) => {
                return category;
            })
            .catch(() => {
                return null;
            })
    }

    async findCategoryByName(name: string, userId: string): Promise<Category | null> {
        return this.findOne({ user: userId, name: name })
            .then((category) => {
                return category;
            })
            .catch(() => {
                return null;
            })
    }
}