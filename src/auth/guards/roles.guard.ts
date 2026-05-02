import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    // 2. Ép kiểu cho Request để TypeScript biết user có tồn tại và có thuộc tính role
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // 3. Kiểm tra user tồn tại và kiểm tra role (Lúc này user.role đã an toàn)
    if (!user || !user.role) return false;

    return requiredRoles.some((role) => user.role === role);
  }
}
