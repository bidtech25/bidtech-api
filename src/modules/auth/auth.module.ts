import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { OwnershipGuard } from './guards/ownership.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SUPABASE_JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard, OwnershipGuard],
  exports: [JwtStrategy, JwtAuthGuard, RolesGuard, OwnershipGuard, PassportModule],
})
export class AuthModule {}
