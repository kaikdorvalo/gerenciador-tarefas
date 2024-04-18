export class CreateCategoryDto {
    name: string;
    color: string;
    user?: string;
    active?: boolean;

    constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }
}