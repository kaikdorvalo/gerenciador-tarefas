import { isDate, isEmail, isEmpty, isHexColor, isURL } from "validator";

export class ValidateFields {
    public validateEmail(email: string): boolean {
        if (typeof email !== 'string') { return false }
        return isEmail(email);
    }

    public validatePassword(password: string): boolean {
        if (typeof password !== 'string') { return false }
        if (password.length < 8) {
            return false
        }
        return true;
    }

    public validateDate(date: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(date)) {
            return false;
        }

        const partesData = date.split('-');
        const ano = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const dia = parseInt(partesData[2], 10);

        const dateObject = new Date(ano, mes, dia);

        return dateObject.getFullYear() === ano &&
            dateObject.getMonth() === mes &&
            dateObject.getDate() === dia;
    }

    public validateUrl(url: string): boolean {
        if (typeof url !== 'string') { return false }
        return isURL(url);
    }

    public validateStatus(status: string): boolean {
        if (typeof status !== 'string') { return false }
        return ['pending', 'in-progress', 'completed'].includes(status);
    }

    public validateHexColor(hex: string): boolean {
        if (typeof hex !== 'string') { return false }
        return isHexColor(hex);
    }

    public validateEmptyString(string: string): boolean {
        if (typeof string !== 'string') { return true }
        return isEmpty(string);
    }
}