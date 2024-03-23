import { CategoryRepository } from "../repositories/category.repository";
import categoryModel from '../schema/category.schema';

class CategoryService {
    private readonly repository = new CategoryRepository(categoryModel);
}

export default new CategoryService();