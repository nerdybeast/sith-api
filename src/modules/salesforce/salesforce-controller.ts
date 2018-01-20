import { Controller, Get, Post, Patch, Delete, Headers, Param, UseInterceptors, createRouteParamDecorator, Body, HttpCode } from '@nestjs/common';
import { StandardSobjectService } from '../../components/services/standard-sobject-service';
import { IResponse } from '../../interfaces/IResponse';
import { ApexLog } from '../../models/sobjects/ApexLog';
import { ConnectionDetails } from '../../models/ConnectionDetails';
import { TraceFlag } from '../../models/sobjects/TraceFlag';
import * as jsonapi from 'jsonapi-serializer';

const Credentials = createRouteParamDecorator((data, req) => {

	const connectionDetails = new ConnectionDetails();
	connectionDetails.instanceUrl = req.headers['instance-url'];
	connectionDetails.orgId = req.headers['org-id'];
	connectionDetails.sessionId = req.headers['salesforce-session-token'];
	connectionDetails.userId = req.headers['user-id'];
	connectionDetails.orgVersion = req.headers['org-version'];

	return connectionDetails;
});

@Controller('api/sobjects')
export class SalesforceController {

	@Get('/apex-logs')
	async apexLogsAsync(@Credentials() credentials: ConnectionDetails) : Promise<any> {

		const standardSobjectService = new StandardSobjectService(credentials);
		const fieldNames = await standardSobjectService.getSobjectFieldNames('ApexLog', credentials.orgId);
		const apexLogs = await standardSobjectService.getApexLogs(credentials.userId, fieldNames);

		const data = new jsonapi.Serializer('apex-log', {
			attributes: ['body', ...fieldNames],
			keyForAttribute: 'camelCase'
		}).serialize(apexLogs);

		return data;
	}

	@Get('/trace-flags')
	async traceFlagsAsync(@Credentials() credentials: ConnectionDetails) : Promise<IResponse> {

		const standardSobjectService = new StandardSobjectService(credentials);
		
		const [ traceFlagFieldNames, debugLevelFieldNames ] = await Promise.all([
			standardSobjectService.getSobjectFieldNames('TraceFlag', credentials.orgId),
			standardSobjectService.getSobjectFieldNames('DebugLevel', credentials.orgId)
		]);
		
		const traceFlags = await standardSobjectService.getTraceFlags(credentials.userId, traceFlagFieldNames, debugLevelFieldNames);

		const data = new jsonapi.Serializer('trace-flag', {
			attributes: [...traceFlagFieldNames, 'debugLevel'],
			keyForAttribute: 'camelCase',
			typeForAttribute(attr) {
				switch(attr) {
					case 'debugLevel': return 'debug-level';
					default: return attr;
				}
			},
			debugLevel: {
				ref: 'id',
				attributes: debugLevelFieldNames
			}
		}).serialize(traceFlags);

		return data;
	}

	@Post('/trace-flags')
	async createTraceFlagAsync(@Body() body, @Credentials() credentials: ConnectionDetails) {

		const newTraceFlag = await new Promise((resolve, reject) => {
			new jsonapi.Deserializer({
				keyForAttribute: 'camelCase'
			}).deserialize(body, (error, data) => {
				if(error) return reject(error);
				return resolve(data);
			});
		});

		const standardSobjectService = new StandardSobjectService(credentials);
		const result = await standardSobjectService.createTraceFlag(newTraceFlag as TraceFlag);
		
		const [ traceFlag, fieldNames ] = await Promise.all([
			standardSobjectService.getTraceFlagById(result.id),
			standardSobjectService.getSobjectFieldNames('TraceFlag', credentials.orgId)
		]);

		const data = new jsonapi.Serializer('trace-flag', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(traceFlag);

		return data;
	}


	@Patch('/trace-flags/:id')
	async updateTraceFlagAsync(@Param() params, @Body() body, @Credentials() credentials: ConnectionDetails) {
		
		const traceFlagId = params.id;

		const traceFlag = await new Promise((resolve, reject) => {
			new jsonapi.Deserializer({
				keyForAttribute: 'camelCase'
			}).deserialize(body, (error, data) => {
				if(error) return reject(error);
				return resolve(data);
			});
		});

		const standardSobjectService = new StandardSobjectService(credentials);
		await standardSobjectService.updateTraceFlag(traceFlag as TraceFlag);

		const [ updatedTraceFlag, fieldNames ] = await Promise.all([
			standardSobjectService.getTraceFlagById(traceFlagId),
			standardSobjectService.getSobjectFieldNames('TraceFlag', credentials.orgId)
		]);

		const data = new jsonapi.Serializer('trace-flag', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(updatedTraceFlag);

		return data;
	}

	@Delete('/trace-flags/:id')
	@HttpCode(204) //No content
	async deleteTraceFlagAsync(@Param() params, @Credentials() credentials: ConnectionDetails) {
		const traceFlagId = params.id;
		const standardSobjectService = new StandardSobjectService(credentials);
		await standardSobjectService.deleteTraceFlagById(traceFlagId);
	}

	@Get('/debug-levels')
	async debugLevelsAsync(@Credentials() credentials: ConnectionDetails) {
		
		const standardSobjectService = new StandardSobjectService(credentials);
		const fieldNames = await standardSobjectService.getSobjectFieldNames('DebugLevel', credentials.orgId);
		const debugLevels = await standardSobjectService.getDebugLevels([], fieldNames);

		const data = new jsonapi.Serializer('debug-level', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(debugLevels);

		return data;
	}

	@Post('/apex-log-body')
	async debugLogAsync(@Credentials() credentials: ConnectionDetails, @Body() body) {

		const standardSobjectService = new StandardSobjectService(credentials);

		const apexLogBody = await standardSobjectService.getDebugLog(body.apexLogId, body.apiVersion);
		return apexLogBody;
	}
}
