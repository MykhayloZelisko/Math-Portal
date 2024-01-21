import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  public constructor(private jwtService: JwtService) {}

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader ? authHeader.split(' ') : [];
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('User is not authorized');
    }
    try {
      const admin = this.jwtService.verify(token);
      req.user = admin;
      return admin.isAdmin;
    } catch (e) {
      throw new UnauthorizedException('User is not authorized');
    }
  }
}
