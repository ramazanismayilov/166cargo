import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { UserRole } from '../enums/user.enum';
import { Role } from './role.decorator';

export const Auth = (...roles: UserRole[]) => {
    return applyDecorators(
        UseGuards(AuthGuard),
        Role(...roles),
        ApiBearerAuth()
    );
}