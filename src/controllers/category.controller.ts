import { Request, Response } from 'express';
import categoryService from '../services/category.service';

class CategoryController {
    async create(req: Request, res: Response) {
        const result = await categoryService.create(req.body, req);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getCatgories(req: Request, res: Response) {
        const result = await categoryService.getCategories(req);
        return res.status(result.statusCode).send(result.metaData);
    }

    async getCategory(req: Request, res: Response) {
        const { id } = req.params;
        const result = await categoryService.getCategory(id, req);
        return res.status(result.statusCode).send(result.metaData);
    }

    async updateCategory(req: Request, res: Response) {
        const result = await categoryService.updateCategory(req.user._id, req.body);
        return res.status(result.statusCode).send(result.metaData);
    }

    async deleteCategory(req: Request, res: Response) {
        const result = await categoryService.deleteCategory(req.user._id, req.body);
        return res.status(result.statusCode).send(result.metaData);
    }
}

export default new CategoryController();