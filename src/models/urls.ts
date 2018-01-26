export class Urls {
	enterprise: string;
	metadata: string;
	partner: string;
	rest: string;
	sobjects: string;
	search: string;
	query: string;
	recent: string;
	tooling_soap: string;
	tooling_rest: string;
	profile: string;
	feeds: string;
	groups: string;
	users: string;
	feed_items: string;
	feed_elements: string;
	custom_domain: string;

	//Comes from describing an sobject
	layout: string; //ex: "/services/data/v34.0/sobjects/Account/describe/layouts/012000000000000AAA"

	//Comes from global describe
	rowTemplate: string; //ex: "/services/data/v34.0/sobjects/WebLink/{ID}"
	describe: string; //ex: "/services/data/v34.0/sobjects/WebLink/describe"
	sobject: string; //ex: "/services/data/v34.0/sobjects/WebLink"
}