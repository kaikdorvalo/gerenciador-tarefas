export class CreateUserDto {
    username: string;
    weight: number;
    password: string;
    email: string;
    canLogin?: boolean;
    photo?: string;
    active?: boolean;

    constructor(username: string, weight: number, password: string, email: string) {
        this.username = username;
        this.weight = weight;
        this.password = password;
        this.email = email
    }
}