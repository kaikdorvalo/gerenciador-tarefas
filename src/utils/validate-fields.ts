import { isEmail, isURL } from "validator";

export class ValidateFields {
    public validateEmail(email: string): boolean {
        if (typeof email != 'string') { return false }
        return isEmail(email);
    }

    public validatePassword(password: string): boolean {
        if (typeof password != 'string') { return false }
        if (password.length < 8) {
            return false
        }
        return true;
    }

    public validateUrl(url: string): boolean {
        if (typeof url != 'string') { return false }
        return isURL(url);
    }
}