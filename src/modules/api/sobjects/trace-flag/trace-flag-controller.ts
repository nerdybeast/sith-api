import { Controller, Body, Param, Get, Post, Patch, Delete, HttpCode } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { ConnectionDetails } from '../../../../models/ConnectionDetails';
import { AbstractSobjectService } from '../../../../components/services/AbstractSobjectService';
import * as jsonapi from 'jsonapi-serializer';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import { TraceFlagService } from '../../../../components/services/TraceFlagService';

@Controller('api/sobjects')
export class TraceFlagController {

	@Get('/trace-flags')
	async traceFlagsAsync(@UserInfo() connectionDetails: ConnectionDetails) {

		const traceFlagService = new TraceFlagService(connectionDetails);
		
		const [ traceFlagFieldNames, debugLevelFieldNames ] = await Promise.all([
			traceFlagService.getSobjectFieldNames(),
			traceFlagService.getSobjectFieldNames('DebugLevel')
		]);
		
		const traceFlags = await traceFlagService.getTraceFlags(connectionDetails.userId, traceFlagFieldNames, debugLevelFieldNames);
		const data = TraceFlagService.serializeToJsonApi(traceFlags, traceFlagFieldNames, debugLevelFieldNames);

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

		const traceFlagService = new TraceFlagService(connectionDetails);
		const result = await traceFlagService.create(newTraceFlag as TraceFlag);
		
		const [ traceFlag, fieldNames ] = await Promise.all([
			traceFlagService.retrieve(result.id),
			traceFlagService.getSobjectFieldNames()
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

		const traceFlagService = new TraceFlagService(connectionDetails);
		await traceFlagService.update(traceFlag as TraceFlag);

		const [ updatedTraceFlag, fieldNames ] = await Promise.all([
			traceFlagService.retrieve(traceFlagId),
			traceFlagService.getSobjectFieldNames()
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
		const traceFlagService = new TraceFlagService(connectionDetails);
		await traceFlagService.delete(traceFlagId);
	}
}