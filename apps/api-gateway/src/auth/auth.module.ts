import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TestController } from './test.controller';

/**
 * AuthModule registers the JWT strategy and provides a guard for protecting routes.
 * It also exports the guard so other modules can use it if needed.
 */
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
  controllers: [TestController],
})
export class AuthModule {}
