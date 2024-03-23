import { Response } from "express";
import { UserSignInDto } from "../dtos/user/user-signin";
import { Errors } from "../enums/errors.enum";
import { HttpStatus } from "../enums/http-status.enum";
import { UserRepository } from "../repositories/user.repository";
import userModel from '../schema/user.schema'
import { Hash } from "../utils/hash";
import { Jwt } from "../utils/jwt";
import { ServiceData } from "../utils/service-data";
import { Messages } from "../enums/messages.enum";
import { ValidateFields } from "../utils/validate-fields";

class AuthService {
    private readonly userRepository = new UserRepository(userModel);
    private validateFields = new ValidateFields();


    async signIn(userSignIn: UserSignInDto, res: Response) {
        if (!this.validateFields.validateEmail(userSignIn.email) || !this.validateFields.validatePassword(userSignIn.password)) {
            return new ServiceData(HttpStatus.BAD_REQUEST, Errors.INVALID_EMAIL_ADDRESS_OR_PASSWORD);
        }

        const user = await this.userRepository.findUserByEmail(userSignIn.email);
        let accessToken: string;

        if (user === null) {
            return new ServiceData(
                HttpStatus.BAD_REQUEST,
                Errors.INVALID_EMAIL_ADDRESS_OR_PASSWORD
            )
        }

        if (!user.canLogin) {
            return new ServiceData(HttpStatus.UNAUTHORIZED);
        }

        const hash = new Hash();
        const result = await hash.compare(userSignIn.password, user.password);

        if (result) {
            const jwt = new Jwt();
            if (user.canLogin) {
                if (user.active) {
                    accessToken = jwt.generateAccessToken(user._id, user.username);
                    const refreshToken = jwt.generateRefreshToken(user._id, user.username);

                    if (await this.userRepository.setRefreshTokenByUserId(user._id, refreshToken)) {
                        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, secure: false });
                    } else {
                        return new ServiceData(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                } else {
                    return new ServiceData(HttpStatus.UNAUTHORIZED);
                }
            } else {
                return new ServiceData(HttpStatus.FORBIDDEN);
            }
        } else {
            return new ServiceData(HttpStatus.UNAUTHORIZED);
        }

        return new ServiceData(HttpStatus.OK, Messages.LOGIN_SUCCESSFULLY, { name: user.username, token: accessToken })
    }
}

export default new AuthService();