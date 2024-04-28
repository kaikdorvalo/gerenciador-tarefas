export class ChangeTaskStatus {
    _id: string
    status: string
    completedDate?: Date

    constructor(_id: string, status: string) {
        this._id = _id;
        this.status = status;
    }
}