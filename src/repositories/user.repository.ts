import { GenericRepository } from "./generic/generic-repository.repository";
import { UserDocument } from '../schema/user.schema'
import { Model } from "mongoose";
import { User } from "../interfaces/user.interface";

export class UserRepository extends GenericRepository<UserDocument> {
    constructor(private userModel: Model<UserDocument>) {
        super(userModel);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.findOne({ email: email });
    }

    async setRefreshTokenByUserId(_id: string, token: string): Promise<boolean> {
        const result = await this.updateOne({ _id: _id }, { refreshToken: token })
        if (result.modifiedCount != 0) {
            return true
        }
        return false
    }

}