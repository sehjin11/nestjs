import { User } from './user.entity';
import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
