import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser: () => ParameterDecorator = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const { user } = request;
	if (!user) throw new UnauthorizedException();

	return user.user;
});
