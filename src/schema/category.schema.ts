import { Schema, model } from 'mongoose'
import { Collections } from '../enums/collections.enum'

const category = new Schema({
    name: {
        type: String,
        required: [true, 'name']
    },
    color: {
        type: String,
        required: [true, 'color']
    }
}, {
    timestamps: true,
})

export default model(Collections.CATEGORIES_SCHEMA, category);