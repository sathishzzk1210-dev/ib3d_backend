import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 1. Skip Swagger & docs routes
    const path = request.path;
    if (
      path.startsWith('/api-docs') ||
      path.startsWith('/swagger') ||
      path.startsWith('/swagger-ui')
    ) {
      return true;
    }

    // 2. Allow routes marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 3. Default behavior → require JWT
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      console.error('JWT Error:', err);
      throw err;
    }
    if (!user) {
      console.error('JWT Validation failed:', info);
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
