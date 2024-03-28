import { Document, FilterQuery, Model, UpdateQuery, UpdateWithAggregationPipeline, UpdateWriteOpResult } from "mongoose";

export class GenericRepository<T extends Document> {

    constructor(private model: Model<T>) { }

    async count(filter: FilterQuery<T>) {
        return await this.model.countDocuments(filter);
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async find(filter: FilterQuery<T>): Promise<T[] | null> {
        return await this.model.find(filter);
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(filter);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id);
    }

    async findByIdAndUpdate(id: string, update: Partial<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, update, { new: true });
    }

    async findByIdAndDelete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id);
    }

    async updateOne(filter: FilterQuery<T>, update: UpdateWithAggregationPipeline | UpdateQuery<T>): Promise<UpdateWriteOpResult> {
        return await this.model.updateOne(filter, update);
    }
}