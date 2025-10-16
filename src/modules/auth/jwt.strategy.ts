import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWTKEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // payload contains { sub: userId, role: role, iat, exp } as we sign below
    return payload; // this becomes req.user
  }
}
