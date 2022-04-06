import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { expressJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'node:util';
import jwt from 'express-jwt';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private auth0_audience: string;
  private auth0_domain: string;

  constructor(private configService: ConfigService) {
    this.auth0_audience = this.configService.get('AUTH0_AUDIENCE') ?? '';
    this.auth0_domain = this.configService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req, res } = GqlExecutionContext.create(context).getContext();
    const verifyJWT = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.auth0_domain}/.well-known/jwks.json`,
        }),
        audience: this.auth0_audience,
        issuer: this.auth0_domain,
        algorithms: ['RS256'],
      }),
    );
    try {
      await verifyJWT(req, res);
      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
