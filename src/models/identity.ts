export class Identity {

	//Salesforce session id, example: "00D17000000BLCa!AQoAQG_wew4qWxn2wUTfNsUKCQerklp2QSsE3HbS3P77Q_bkQU_obNT2pTMoEtaxdZMt3K057dklrW7rdjlopv53f06l2CuI"
	access_token: string;

	//Example: "salesforce-sandbox"
	provider: string;

	//Example: "005G0000003pal8IAA"
	user_id: string;

	//Example: "salesforce-sandbox"
	connection: string;

	isSocial: boolean;
}