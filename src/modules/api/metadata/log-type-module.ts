import { Module, Controller, Get } from '@nestjs/common';
import { LogType } from '../../../models/enums/log-type';

@Controller('api/metadata/log-types')
class LogTypeController {

	@Get('/')
	async getAvailableLogTypes() {
		
		return {
			data: [LogType.CLASS_TRACING, LogType.USER_DEBUG]
		};

	}

}

@Module({
	controllers: [LogTypeController]
})
export class LogTypeModule { }