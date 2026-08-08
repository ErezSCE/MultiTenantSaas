import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from './api-key.entity';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepo: Repository<ApiKeyEntity>,
  ) {}

  /**
   * Generates a new API key for a tenant.
   * Returns the raw key (not stored) and persists the hashed version.
   */
  async generateKey(tenantId: string): Promise<string> {
    // Generate a 32-byte random string encoded as hex (64 chars)
    const rawKey = crypto.randomBytes(32).toString('hex');
    const keyHash = this.hashKey(rawKey);
    const entity = this.apiKeyRepo.create({
      keyHash,
      tenantId,
    });
    await this.apiKeyRepo.save(entity);
    return rawKey;
  }

  /**
   * Revokes an existing API key by id.
   */
  async revokeKey(id: string): Promise<void> {
    const apiKey = await this.apiKeyRepo.findOne({ where: { id } });
    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }
    apiKey.revokedAt = new Date();
    await this.apiKeyRepo.save(apiKey);
  }

  /**
   * Helper to hash a raw key using SHA-256.
   */
  private hashKey(rawKey: string): string {
    return crypto.createHash('sha256').update(rawKey).digest('hex');
  }
}
