import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UserRepository } from "../repositories/user.repository";
import userModel from '../schema/user.schema';
import { ValidateFields } from "../utils/validate-fields";
import { ServiceData } from "../utils/service-data";
import { HttpStatus } from "../enums/http-status.enum";
import { Errors } from "../enums/errors.enum";
import { Hash } from "../utils/hash";
import { Messages } from "../enums/messages.enum";

class UserService {
    private readonly repository = new UserRepository(userModel);
    private validateFields = new ValidateFields();

    async create(createUser: CreateUserDto) {
        if (!this.validateFields.validateEmail(createUser.email)) {
            return new ServiceData(
                HttpStatus.BAD_REQUEST,
                Errors.INVALID_EMAIL_ADDRESS
            );
        }
        if (!this.validateFields.validatePassword(createUser.password)) {
            return new ServiceData(
                HttpStatus.BAD_REQUEST,
                Errors.PASSWORD_LENGTH
            )
        }
        if (createUser.photo) {
            if (!this.validateFields.validateUrl(createUser.photo)) {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.INVALID_PHOTO_URL
                )
            }
        }
        if (await this.repository.findUserByEmail(createUser.email)) {
            return new ServiceData(
                HttpStatus.BAD_REQUEST,
                Errors.EMAIL_ALREADY_IN_USE
            )
        }

        const hash = new Hash();
        createUser.active = true;
        createUser.canLogin = true;
        createUser.password = await hash.encode(createUser.password);

        return this.repository.create(createUser)
            .then(() => {
                return new ServiceData(
                    HttpStatus.OK,
                    Messages.USER_CREATED_SUCCESSFULLY,
                )
            })
            .catch(() => {
                return new ServiceData(
                    HttpStatus.BAD_REQUEST,
                    Errors.MISSING_USER_INFORMATIONS
                )
            })
    }


}

export default new UserService();