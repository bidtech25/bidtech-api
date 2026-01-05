import { UserRole } from './user-role.enum';

export interface JwtPayload {
  sub: string;        // user_id do Supabase
  email: string;
  role: string;       // 'admin' | 'user' | 'viewer'
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
