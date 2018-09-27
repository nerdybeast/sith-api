import { toNumber } from '../../utilities/Cast';

export class HistoryRetentionPolicy {
	public archiveAfterMonths: number;
	public archiveRetentionYears: number;
	public description: string;
	public gracePeriodDays: number;

	constructor(json: any = {}) {
		this.archiveAfterMonths = toNumber(json.archiveAfterMonths);
		this.archiveRetentionYears = toNumber(json.archiveRetentionYears);
		this.description = json.description || null;
		this.gracePeriodDays = toNumber(json.gracePeriodDays);
	}
}