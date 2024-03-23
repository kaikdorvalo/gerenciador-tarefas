import { GenericRepository } from "./generic/generic-repository.repository";
import { Model } from "mongoose";
import { CategoryDocument } from "../schema/category.schema";

export class CategoryRepository extends GenericRepository<CategoryDocument> {
    constructor(private userModel: Model<CategoryDocument>) {
        super(userModel);
    }
}