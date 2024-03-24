import { Document, Schema, model } from 'mongoose'
import { Collections } from '../enums/collections.enum'
import { Category } from '../interfaces/category.interface';

export type CategoryDocument = Category & Document;

const Category = new Schema({
    name: {
        type: String,
        required: [true, 'name']
    },
    color: {
        type: String,
        required: [true, 'color']
    },
    user: {
        type: String,
        required: [true, 'user']
    },
    active: {
        type: Boolean,
        required: [true, 'active']
    }
}, {
    timestamps: true,
})

export default model<CategoryDocument>(Collections.CATEGORIES_SCHEMA, Category);