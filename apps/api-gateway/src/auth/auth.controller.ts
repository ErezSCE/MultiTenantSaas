import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { EmailService } from './email.service';

interface InviteDto {
  tenantId: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly emailService: EmailService,
  ) {}

  @Post('invite')
  async invite(@Body() dto: InviteDto) {
    const { tenantId, email } = dto;
    if (!tenantId || !email) {
      throw new HttpException('tenantId and email are required', HttpStatus.BAD_REQUEST);
    }
    const invitation = this.invitationService.createInvitation(tenantId, email);
    try {
      await this.emailService.sendInvitation(email, invitation.token);
    } catch (err) {
      // If email fails, we still consider invitation created but log error
      // For simplicity, rethrow to indicate failure
      throw new HttpException('Failed to send invitation email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { token: invitation.token, expiresAt: invitation.expiresAt };
  }
}
