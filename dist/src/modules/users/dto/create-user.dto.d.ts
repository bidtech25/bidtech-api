export declare enum UserRole {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER"
}
export declare class CreateUserDto {
    email: string;
    name: string;
    role?: string;
}
