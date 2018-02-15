import { PollingBase } from './PollingBase';
import { ConnectionDetails } from '../ConnectionDetails';

export class OrgPoller extends PollingBase {
	connections: ConnectionDetails[];
}