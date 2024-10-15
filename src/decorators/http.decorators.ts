import {
  applyDecorators,
  Param,
  ParseUUIDPipe,
  type PipeTransform,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type Type } from '@nestjs/common/interfaces';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { type RoleType } from '../constants';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SessionGuard } from '../guards/session.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import { PublicRoute } from './public-route.decorator';
import { Roles } from './roles.decorator';

export function Auth(
  roles: RoleType[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    Roles(roles),
    // FIXME: check SessionGuard in UseGuards
    UseGuards(
      SessionGuard,
      AuthGuard({ public: isPublicRoute }),
      RolesGuard,
      SessionGuard,
    ),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    PublicRoute(isPublicRoute),
  );
}

export function UUIDParam(
  property: string,
  ...pipes: Array<Type<PipeTransform> | PipeTransform>
): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
