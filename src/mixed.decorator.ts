import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Mixed = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return { query: req.query, body: req.body };
});
