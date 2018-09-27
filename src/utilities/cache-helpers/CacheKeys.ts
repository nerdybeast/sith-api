export class CacheKeys {
	public static sobjectFileProperties(orgId: string, sobjectName: string) : string {
		return `SOBJECT_FILE_PROPERTIES:${orgId}:${sobjectName}`;
	}
}