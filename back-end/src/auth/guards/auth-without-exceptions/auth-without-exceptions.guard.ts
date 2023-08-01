import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthWithoutExceptionsGuard implements CanActivate {
  public constructor(private jwtService: JwtService) {}

  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        req.user = null;
        return true;
      } else {
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];
        if (bearer !== 'Bearer' || !token) {
          req.user = null;
          return true;
        } else {
          const user = this.jwtService.verify(token);
          req.user = user;
          return true;
        }
      }
    } catch (e) {
      throw new UnauthorizedException({ message: 'User is not authorized' });
    }
  }
}
