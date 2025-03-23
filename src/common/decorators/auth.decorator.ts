import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { UserRole } from '../enums/user.enum';
import { Role } from './role.decorator';
import { RoleGuard } from '../guards/role.guard';

export const Auth = (...roles: UserRole[]) => {
    return applyDecorators(
        UseGuards(AuthGuard, RoleGuard),
        Role(...roles),
        ApiBearerAuth()
    );
}