import { GenericRepository } from "./generic/generic-repository.repository";
import { UserDocument } from '../schema/user.schema'
import { Model } from "mongoose";
import { User } from "../interfaces/user.interface";
import { UpdateUserDto } from "../dtos/user/update-user.dto";
import { updateUserPassword } from "../dtos/user/update-user-password";

export class UserRepository extends GenericRepository<UserDocument> {
    constructor(private userModel: Model<UserDocument>) {
        super(userModel);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.findOne({ email: email, active: true });
    }

    async setRefreshTokenByUserId(_id: string, token: string): Promise<boolean> {
        return this.updateOne({ _id: _id, active: true }, { refreshToken: token })
            .then((result) => {
                if (result.modifiedCount != 0) {
                    return true
                }
                return false;
            })
            .catch(() => {
                return false
            })
    }

    async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
        return await this.findOne({ refreshToken: refreshToken });
    }

    async updateUser(userId: string, updateUser: UpdateUserDto) {
        return await this.updateOne({ _id: userId }, updateUser)
            .then((result) => {
                if (result.matchedCount !== 0) {
                    return true;
                }
                return false;
            })
            .catch(() => {
                return false;
            })
    }

    async updateUserPassword(userId: string, updatePassword: updateUserPassword) {
        return await this.updateOne({ _id: userId }, updatePassword)
            .then((result) => {
                if (result.modifiedCount === 1) {
                    return true;
                }

                return false;
            })
            .catch(() => {
                return false;
            })
    }

}