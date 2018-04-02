import { createRouteParamDecorator } from '@nestjs/common';
import { Connection } from '../models/Connection';

export const UserInfo = createRouteParamDecorator((data, req) => {
	return new Connection(req.connectionDetails);
});