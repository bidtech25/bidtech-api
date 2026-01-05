import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SupabaseUserCreatedPayload } from './interfaces/supabase-webhook.interface';
export declare class AuthService {
    private config;
    private usersService;
    private readonly logger;
    private readonly webhookSecret;
    constructor(config: ConfigService, usersService: UsersService);
    handleUserCreated(payload: SupabaseUserCreatedPayload): Promise<{
        success: boolean;
        message: string;
        userId?: undefined;
    } | {
        success: boolean;
        userId: string;
        message?: undefined;
    }>;
    verifyWebhookSignature(signature: string, payload: any): boolean;
}
