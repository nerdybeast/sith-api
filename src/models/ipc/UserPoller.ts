import { PollingBase } from './PollingBase';
import { ConnectionDetails } from '../ConnectionDetails';

export class UserPoller extends PollingBase {
	connection: ConnectionDetails;
}