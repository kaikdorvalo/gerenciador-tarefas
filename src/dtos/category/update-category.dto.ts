export class UpdateCategoryDto {
    _id: string;
    name?: string;
    color?: string;

    constructor(_id: string, name?: string, color?: string) {
        this._id = _id;
        this.name = name;
        this.color = color;
    }
}