import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

export interface Invitation {
  token: string;
  tenantId: string;
  email: string;
  expiresAt: Date;
}

@Injectable()
export class InvitationService {
  private readonly invitations = new Map<string, Invitation>();
  private readonly ttlMs = 24 * 60 * 60 * 1000; // 24 hours

  createInvitation(tenantId: string, email: string): Invitation {
    const expiresAt = new Date(Date.now() + this.ttlMs);
    const token = this.generateToken(tenantId, email, expiresAt);
    const invitation: Invitation = { token, tenantId, email, expiresAt };
    this.invitations.set(token, invitation);
    return invitation;
  }

  private generateToken(tenantId: string, email: string, expiresAt: Date): string {
    const payload = `${tenantId}:${email}:${expiresAt.getTime()}`;
    const random = randomBytes(8).toString('hex');
    const raw = `${payload}:${random}`;
    return Buffer.from(raw).toString('base64url');
  }

  validateToken(token: string): boolean {
    const invitation = this.invitations.get(token);
    if (!invitation) return false;
    if (invitation.expiresAt < new Date()) {
      this.invitations.delete(token);
      return false;
    }
    return true;
  }

  // For testing purposes, expose retrieval
  getInvitation(token: string): Invitation | undefined {
    return this.invitations.get(token);
  }
}
