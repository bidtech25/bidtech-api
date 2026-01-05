import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import type { SupabaseUserCreatedPayload } from './interfaces/supabase-webhook.interface';

@ApiTags('Auth')
@Controller('webhooks/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user-created')
  @Public()
  @ApiOperation({ summary: 'Webhook de criação de usuário do Supabase' })
  @ApiResponse({ status: 200, description: 'User synchronized successfully' })
  async handleUserCreated(
    @Headers('x-supabase-signature') signature: string,
    @Body() payload: SupabaseUserCreatedPayload,
  ) {
    // Verificar assinatura do webhook (segurança)
    if (!this.authService.verifyWebhookSignature(signature, payload)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return await this.authService.handleUserCreated(payload);
  }
}
