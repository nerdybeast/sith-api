import { Controller, Body, Param, Get, Post, Patch, Delete, HttpCode } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import jsonapi from 'jsonapi-serializer';
import { TraceFlag } from '../../../../models/sobjects/TraceFlag';
import { TraceFlagService } from '../../../../components/services/TraceFlagService';
import { Connection } from '../../../../models/Connection';
import { ConnectionFactory } from '../../../../components/connection/ConnectionFactory';

@Controller('api/sobjects')
export class TraceFlagController {

	private connectionFactory: ConnectionFactory;

	constructor(connectionFactory: ConnectionFactory) {
		this.connectionFactory = connectionFactory;
	}

	@Get('/trace-flags')
	async traceFlagsAsync(@UserInfo() connection: Connection) {

		const debugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const traceFlagService = this.connectionFactory.createTraceFlagService(connection, debugLevelService);
		
		const [ traceFlagFieldNames, debugLevelFieldNames ] = await Promise.all([
			traceFlagService.getSobjectFieldNames(),
			debugLevelService.getSobjectFieldNames('DebugLevel')
		]);
		
		const traceFlags = await traceFlagService.getTraceFlags(connection.details.userId, traceFlagFieldNames, debugLevelFieldNames);
		const serializedTraceFlags = TraceFlagService.serializeToJsonApi(traceFlags, traceFlagFieldNames, debugLevelFieldNames);

		return serializedTraceFlags;
	}

	@Post('/trace-flags')
	async createTraceFlagAsync(@UserInfo() connection: Connection, @Body() body) {

		const newTraceFlag = await new Promise((resolve, reject) => {
			new jsonapi.Deserializer({
				keyForAttribute: 'camelCase'
			}).deserialize(body, (error, deserializedTraceFlag) => {
				if(error) return reject(error);
				return resolve(deserializedTraceFlag);
			});
		});

		const debugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const traceFlagService = this.connectionFactory.createTraceFlagService(connection, debugLevelService);
		const result = await traceFlagService.create(newTraceFlag as TraceFlag);
		
		const [ traceFlag, fieldNames ] = await Promise.all([
			traceFlagService.retrieve(result.id),
			traceFlagService.getSobjectFieldNames()
		]);

		const serializedTraceFlags = new jsonapi.Serializer('trace-flag', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(traceFlag);

		return serializedTraceFlags;
	}

	@Patch('/trace-flags/:id')
	async updateTraceFlagAsync(@Param() params, @Body() body, @UserInfo() connection: Connection) {
		
		const traceFlagId = params.id;

		const traceFlag = await new Promise((resolve, reject) => {
			new jsonapi.Deserializer({
				keyForAttribute: 'camelCase'
			}).deserialize(body, (error, deserializedTraceFlag) => {
				if(error) return reject(error);
				return resolve(deserializedTraceFlag);
			});
		});

		const debugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const traceFlagService = this.connectionFactory.createTraceFlagService(connection, debugLevelService);
		await traceFlagService.update(traceFlag as TraceFlag);

		const [ updatedTraceFlag, fieldNames ] = await Promise.all([
			traceFlagService.retrieve(traceFlagId),
			traceFlagService.getSobjectFieldNames()
		]);

		const serializedTraceFlags = new jsonapi.Serializer('trace-flag', {
			attributes: fieldNames,
			keyForAttribute: 'camelCase'
		}).serialize(updatedTraceFlag);

		return serializedTraceFlags;
	}

	@Delete('/trace-flags/:id')
	@HttpCode(204) //No content
	async deleteTraceFlagAsync(@Param() params, @UserInfo() connection: Connection) {

		const traceFlagId = params.id;

		const debugLevelService = this.connectionFactory.createDebugLevelService(connection);
		const traceFlagService = this.connectionFactory.createTraceFlagService(connection, debugLevelService);

		await traceFlagService.delete(traceFlagId);
	}
}