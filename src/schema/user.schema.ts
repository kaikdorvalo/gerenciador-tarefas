import { Document, Schema, model } from 'mongoose'
import { Collections } from '../enums/collections.enum'
import { User } from '../interfaces/user.interface';

export type UserDocument = User & Document;

const UserSchema = new Schema({
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
    canLogin: {
        type: Boolean,
        required: [true, 'canLogin']
    },
    photo: String,
    active: {
        type: Boolean,
        required: [true, 'active']
    }
}, {
    timestamps: true,
});

export default model<UserDocument>(Collections.USERS_SCHEMA, UserSchema);