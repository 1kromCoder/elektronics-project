import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserFromToken = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return key ? user?.[key] : user;
  },
);
