import { Controller, Body, Param, Get, Post, Patch, Delete, HttpCode } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { StandardSobjectService } from '../../../../components/services/standard-sobject-service';
import * as jsonapi from 'jsonapi-serializer';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';

@Controller('api/sobjects')
export class TraceFlagController {

	@Get('/trace-flags')
	async traceFlagsAsync(@UserInfo() connectionDetails: ConnectionDetails) {

		const standardSobjectService = new StandardSobjectService(connectionDetails);
		
		const [ traceFlagFieldNames, debugLevelFieldNames ] = await Promise.all([
			standardSobjectService.getSobjectFieldNames('TraceFlag', connectionDetails.orgId),
			standardSobjectService.getSobjectFieldNames('DebugLevel', connectionDetails.orgId)
		]);
		
		const traceFlags = await standardSobjectService.getTraceFlags(connectionDetails.userId, traceFlagFieldNames, debugLevelFieldNames);

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
	async createTraceFlagAsync(@UserInfo() connectionDetails: ConnectionDetails, @Body() body) {

		const newTraceFlag = await new Promise((resolve, reject) => {
			new jsonapi.Deserializer({
				keyForAttribute: 'camelCase'
			}).deserialize(body, (error, data) => {
				if(error) return reject(error);
				return resolve(data);
			});
		});

		const standardSobjectService = new StandardSobjectService(connectionDetails);
		const result = await standardSobjectService.createTraceFlag(newTraceFlag as TraceFlag);
		
		const [ traceFlag, fieldNames ] = await Promise.all([
			standardSobjectService.getTraceFlagById(result.id),
			standardSobjectService.getSobjectFieldNames('TraceFlag', connectionDetails.orgId)
		]);

		const data = new jsonapi.Serializer('trace-flag', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(traceFlag);

		return data;
	}

	@Patch('/trace-flags/:id')
	async updateTraceFlagAsync(@Param() params, @Body() body, @UserInfo() connectionDetails: ConnectionDetails) {
		
		const traceFlagId = params.id;

		const traceFlag = await new Promise((resolve, reject) => {
			new jsonapi.Deserializer({
				keyForAttribute: 'camelCase'
			}).deserialize(body, (error, data) => {
				if(error) return reject(error);
				return resolve(data);
			});
		});

		const standardSobjectService = new StandardSobjectService(connectionDetails);
		await standardSobjectService.updateTraceFlag(traceFlag as TraceFlag);

		const [ updatedTraceFlag, fieldNames ] = await Promise.all([
			standardSobjectService.getTraceFlagById(traceFlagId),
			standardSobjectService.getSobjectFieldNames('TraceFlag', connectionDetails.orgId)
		]);

		const data = new jsonapi.Serializer('trace-flag', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(updatedTraceFlag);

		return data;
	}

	@Delete('/trace-flags/:id')
	@HttpCode(204) //No content
	async deleteTraceFlagAsync(@Param() params, @UserInfo() connectionDetails: ConnectionDetails) {
		const traceFlagId = params.id;
		const standardSobjectService = new StandardSobjectService(connectionDetails);
		await standardSobjectService.deleteTraceFlagById(traceFlagId);
	}
}