import { AuthService } from './auth.service';
import type { SupabaseUserCreatedPayload } from './interfaces/supabase-webhook.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    handleUserCreated(signature: string, payload: SupabaseUserCreatedPayload): Promise<{
        success: boolean;
        message: string;
        userId?: undefined;
    } | {
        success: boolean;
        userId: string;
        message?: undefined;
    }>;
}
