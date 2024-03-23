export class CreateUserDto {
    username: string;
    weight: number;
    password: string;
    email: string;
    canLogin?: boolean;
    photo?: string;
    active?: boolean;
}