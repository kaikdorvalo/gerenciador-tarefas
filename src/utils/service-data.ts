import { HttpStatus } from "../enums/http-status.enum";

export class ServiceMetaData {
    message?: string;
    data?: any;

    constructor(message?: string, data?: any) {
        this.message = message;
        this.data = data;
    }
}

export class ServiceData {
    statusCode: HttpStatus;
    metaData: ServiceMetaData

    constructor(statusCode?: HttpStatus, message?: string, data?: any) {
        this.statusCode = statusCode as HttpStatus;
        this.metaData = new ServiceMetaData(message, data);
    }
}
