import Joi from '@hapi/joi';
import { IEnvironmentVariables } from './IEnvironmentVariables';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class ConfigService {

	private environmentVariables: any;

	constructor(@Inject('environment-variables') environmentVariables: IEnvironmentVariables) {
		this.environmentVariables = this.validateEnvironmentVariables(environmentVariables);
	}

	public get REDIS_URL() : string {
		return this.environmentVariables.REDIS_URL;
	}

	public get AUTH0_API_CLIENT_ID() : string {
		return this.environmentVariables.AUTH0_API_CLIENT_ID;
	}

	public get AUTH0_API_CLIENT_SECRET() : string {
		return this.environmentVariables.AUTH0_API_CLIENT_SECRET;
	}

	public get TRACE_FLAG_POLLING_RATE() : number {
		return this.environmentVariables.TRACE_FLAG_POLLING_RATE;
	}

	public get APEX_LOG_POLLING_RATE() : number {
		return this.environmentVariables.APEX_LOG_POLLING_RATE;
	}

	public get PORT() : number {
		return this.environmentVariables.PORT;
	}

	public get ROLLBAR_ACCESS_TOKEN() : string {
		return this.environmentVariables.ROLLBAR_ACCESS_TOKEN;
	}

	private validateEnvironmentVariables(environmentVariables: IEnvironmentVariables) : any {

		const schema: Joi.ObjectSchema = Joi.object({
			REDIS_URL: Joi.string().required(),
			AUTH0_API_CLIENT_ID: Joi.string().required(),
			AUTH0_API_CLIENT_SECRET: Joi.string().required(),
			TRACE_FLAG_POLLING_RATE: Joi.number().integer().default('5000'),
			APEX_LOG_POLLING_RATE: Joi.number().integer().default('5000'),
			PORT: Joi.number().integer().default('5000'),
			ROLLBAR_ACCESS_TOKEN: Joi.string().required()
		});

		const { error, value } = schema.validate(environmentVariables, {
			allowUnknown: true
		});

		if(error) {
			throw new Error(`Configuration validation error: ${error.message}`);
		}

		return value;
	}
}