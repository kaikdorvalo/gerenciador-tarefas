import { Schema, model } from 'mongoose'
import { Collections } from '../enums/collections.enum'

const task = new Schema({
    title: {
        type: String,
        required: [true, 'title']
    },
    description: {
        type: String,
        required: [true, 'description']
    },
    startDate: {
        type: Date,
        required: [true, 'startDate']
    },
    endDate: {
        type: Date,
        required: [true, 'endDate']
    },
    type: {
        type: String,
        required: [true, 'type']
    },
    category: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        required: [true, 'status']
    },
    user: {
        type: String,
        required: [true, 'user']
    }
}, {
    timestamps: true,
})

export default model(Collections.TASK_SCHEMA, task);