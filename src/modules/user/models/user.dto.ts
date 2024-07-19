export type UserDto = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    passwordSalt: string;
    birthdate: Date;
    blocked: boolean;
}