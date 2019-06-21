import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConnectionDetails } from '../models/ConnectionDetails';
import { Request, Response } from 'express';

@Injectable()
export class ConnectionDetailsMiddleware implements NestMiddleware {
	
	use(req: Request, res: Response, next: Function) {

		const connectionDetails = new ConnectionDetails();
		connectionDetails.instanceUrl = req.headers['instance-url'] as string;
		connectionDetails.organizationId = req.headers['organization-id'] as string;
		connectionDetails.sessionId = req.headers['salesforce-session-token'] as string;
		connectionDetails.userId = req.headers['user-id'] as string;
		connectionDetails.orgVersion = req.headers['org-version'] as string;

		//@ts-ignore - "connectionDetails" does not exist on the express Request object but we're throwing it on there anyway...
		req.connectionDetails = connectionDetails;

		//@ts-ignore - "user" does not exist on the express Request object but we're throwing it on there anyway...
		req.user = connectionDetails;

		next();
	}
}