import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SupabaseUserCreatedPayload } from './interfaces/supabase-webhook.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly webhookSecret: string;

  constructor(
    private config: ConfigService,
    private usersService: UsersService,
  ) {
    this.webhookSecret = this.config.get<string>('SUPABASE_WEBHOOK_SECRET') || '';
  }

  async handleUserCreated(payload: SupabaseUserCreatedPayload) {
    this.logger.log(`Processing user creation webhook for: ${payload.record.email}`);

    try {
      const { id, email, raw_user_meta_data } = payload.record;

      // Verificar se usuário já existe
      const existing = await this.usersService.findById(id);
      
      if (existing) {
        this.logger.warn(`User ${email} already exists in database`);
        return { success: true, message: 'User already exists' };
      }

      // Criar usuário
      const user = await this.usersService.createFromWebhook({
        id: id,
        email,
        name: raw_user_meta_data?.full_name || email.split('@')[0],
        role: 'user', // Default role
      });

      this.logger.log(`User ${email} created successfully with ID: ${user.id}`);

      return { success: true, userId: user.id };
    } catch (error) {
      this.logger.error(`Failed to create user from webhook: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process user creation webhook');
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyWebhookSignature(signature: string, payload: any): boolean {
    if (!this.webhookSecret) return true; // Bypass if no secret configured
    // TODO: Implementar verificação de assinatura do webhook
    // Supabase envia um header 'x-supabase-signature' para validar
    return true; // Simplificado por enquanto
  }
}
