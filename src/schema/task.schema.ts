import { Document, Schema, model } from 'mongoose'
import { Collections } from '../enums/collections.enum'
import { Task } from '../interfaces/task.interface';
import { TaskStatus } from '../enums/task-status.enum';

export type TaskDocument = Task & Document;

const Task = new Schema({
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
    completed: {
        type: Boolean,
        required: [true, 'completed']
    },
    completedDate: {
        type: Date
    },
    status: {
        type: String,
        enum: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
        required: [true, 'status']
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

export default model<TaskDocument>(Collections.TASK_SCHEMA, Task);