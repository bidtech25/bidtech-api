import { UserRole } from './user-role.enum';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
    aud?: string;
    iss?: string;
}
export interface RequestUser {
    id: string;
    email: string;
    role: UserRole;
    companyId?: string;
}
