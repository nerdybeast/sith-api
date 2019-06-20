import { createParamDecorator } from '@nestjs/common';
import { Connection } from '../models/Connection';

export const UserInfo = createParamDecorator((_data: any, req: any) => {
	return new Connection(req.connectionDetails);
});