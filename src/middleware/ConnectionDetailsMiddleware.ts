import { Middleware, NestMiddleware, ExpressMiddleware } from '@nestjs/common';
import { ConnectionDetails } from '../models/ConnectionDetails';

@Middleware()
export class ConnectionDetailsMiddleware implements NestMiddleware {
	resolve(...args: any[]): ExpressMiddleware {
		return (req, res, next) => {
			
			const connectionDetails = new ConnectionDetails();
			connectionDetails.instanceUrl = req.headers['instance-url'];
			connectionDetails.organizationId = req.headers['organization-id'];
			connectionDetails.sessionId = req.headers['salesforce-session-token'];
			connectionDetails.userId = req.headers['user-id'];
			connectionDetails.orgVersion = req.headers['org-version'];

			req.connectionDetails = connectionDetails;

			next();
		};
	}
}