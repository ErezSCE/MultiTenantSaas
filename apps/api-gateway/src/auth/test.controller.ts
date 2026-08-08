import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Simple controller to test JWT authentication.
 */
@Controller('test')
export class TestController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProtected() {
    return { message: 'protected data' };
  }
}
