import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

/**
 * JWT strategy that validates Auth0 issued tokens.
 * For simplicity in this implementation we fall back to a static secret if JWKS is not configured.
 * In production, set AUTH0_DOMAIN and AUTH0_AUDIENCE environment variables to enable JWKS verification.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const audience = process.env.AUTH0_AUDIENCE;
    const secretOrKeyProvider = auth0Domain
      ? // Use jwks-rsa to retrieve signing keys dynamically
        jwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
        })
      : // Fallback to a static secret for local development / tests
        undefined;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: secretOrKeyProvider,
      secretOrKey: secretOrKeyProvider ? undefined : process.env.JWT_SECRET || 'test-secret',
      audience: audience,
      issuer: auth0Domain ? `https://${auth0Domain}/` : undefined,
      algorithms: ['RS256', 'HS256'],
    });
  }

  // The validate method is called after the token is verified.
  // It should return the payload that will be attached to the request object.
  async validate(payload: any) {
    // Ensure required claims are present
    if (!payload.tenantId || !payload.role) {
      // Throwing an error will result in an unauthorized response
      throw new Error('Invalid token payload');
    }
    return payload;
  }
}
