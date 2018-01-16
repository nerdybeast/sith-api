import { Urls } from './urls';
import { ProfileStatus } from './profile-status';
import { Identity } from './identity';

export class Profile {
	picture: string;
	picture_thumbnail: string;
	email: string;
	name: string;
	family_name: string;
	given_name: string;
	nickname: string;
	email_verified: boolean;
	id: string;
	organization_id: string;
	username: string;
	timezone: string;
	mobile_phone_verified: boolean;
	status: ProfileStatus;
	urls: Urls;
	active: boolean;
	user_type: string;
	language: string;
	locale: string;
	utcOffset: number;
	last_modified_date: string;
	is_app_installed: boolean;
	updated_at: string;

	//Dev example: "salesforce-sandbox|005G0000003pal8IAA"
	//Prod example: "005G0000003pal8IAA"
	user_id: string;

	identities: Identity[];
	created_at: string;
	is_lightning_login_user: boolean;
	last_ip: string;
	last_login: string;
	logins_count: number;
}