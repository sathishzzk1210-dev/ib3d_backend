import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { logger } from 'src/core/utils/logger';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const excludedRoutes = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auth/signup-admin',
      '/api/v1/auth/resend-otp',
      '/api/v1/auth/forgot-password',
      '/api/v1/auth/reset-password',
      '/api/v1/auth/refresh',
      '/api/v1/auth/signup',
      '/api/v1/auth/signup-staff',
      '/api/v1/auth/signup-branch-admin',
      '/api/v1/auth/signup-super-admin',
      '/api/v1/auth/me',
    ];

    const path = req.originalUrl.split('?')[0]; // strip query params

    if (excludedRoutes.includes(path)) {
      return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ code: 401, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ code: 401, message: 'Unauthorized' });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWTKEY);
      req['user'] = decodedToken;
    } catch (error) {
      logger.error('Token error: ' + JSON.stringify(error?.message || error));
      if (error.name === 'TokenExpiredError') {
        return res.status(403).json({ code: 401, message: 'Token has expired.' });
      }
      return res.status(401).json({ code: 401, message: 'Invalid token' });
    }

    next();
  }
}
