import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard that uses the 'jwt' strategy to protect routes.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
