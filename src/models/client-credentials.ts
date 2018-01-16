export class ClientCredentials {

	//The Auth0 JWT used to make calls to other Auth0 apis.
	access_token: string;

	//In miliseconds
	expires_in: number;

	scope: string;
	token_type: string;
}