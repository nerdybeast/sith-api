import { createRouteParamDecorator } from '@nestjs/common';

export const UserInfo = createRouteParamDecorator((data, req) => {
	return req.connectionDetails;
});