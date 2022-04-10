import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type AuthUser = {
  sub: string;
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    // const ctx = GqlExecutionContext.create(context);
    // const req = ctx.getContext().req;
    // return req.user;
    return { sub: 'auth0-teste' };
  },
);
