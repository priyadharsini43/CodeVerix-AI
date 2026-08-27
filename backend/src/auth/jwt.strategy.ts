import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          if (request?.cookies?.access_token) {
            return request.cookies.access_token;
          }
          if (request?.headers?.authorization) {
            const authHeader = request.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
              return authHeader.substring(7);
            }
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'codeverix_super_secret_jwt_key_2026_dev_env',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return { userId: user.id, email: user.email, name: user.name };
  }
}
