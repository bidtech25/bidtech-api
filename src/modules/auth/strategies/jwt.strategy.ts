import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, RequestUser } from '../interfaces/jwt-payload.interface';
import { UserRole } from '../interfaces/user-role.enum';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('SUPABASE_JWT_SECRET') || 'FALLBACK_SECRET',
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Validar role
    let role = payload.role as UserRole;
    if (payload.role === 'authenticated') {
        role = UserRole.USER; 
    }

    // Hydrate User Profile from DB
    let companyId: string | undefined;
    try {
      const userProfile = await this.usersService.findBySupabaseId(payload.sub);
      if (userProfile) {
        companyId = userProfile.companyId || undefined;
        // Optionally update role from DB if needed
        // role = userProfile.role || role;
      } else {
        this.logger.warn(`User authenticated but not found in Supabase/Prisma Profile: ${payload.sub}`);
        // Optional: Trigger creation/sync here if appropriate
      }
    } catch (error) {
       this.logger.error(`Error hydrating user profile for ${payload.sub}: ${error.message}`);
       // We don't block auth, but companyId will be missing
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: role || UserRole.USER,
      companyId: companyId,
    };
  }
}
