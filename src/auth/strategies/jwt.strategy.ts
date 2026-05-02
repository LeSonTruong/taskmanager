import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// Interface mô tả cấu trúc của dữ liệu bên trong JWT
interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret', // Trong thực tế nên để ở file .env
    });
  }

  validate(payload: JwtPayload) {
    // Trả về dữ liệu để NestJS đính kèm vào req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
