import { Schema, model } from 'mongoose'
import { Collections } from '../enums/collections.enum'

const user = new Schema({
    username: {
        type: String,
        required: [true, 'username']
    },
    weight: {
        type: Number,
        required: [true, 'weight']
    },
    password: {
        type: String,
        required: [true, 'password']
    },
    email: {
        type: String,
        required: [true, 'email']
    },
    refreshToken: String,
    photo: String,
    active: {
        type: Boolean,
        required: [true, 'active']
    }
}, {
    timestamps: true,
})

export default model(Collections.USERS_SCHEMA, user);