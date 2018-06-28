import { Controller, Get, Query } from '@nestjs/common';
import { UserInfo } from '../../../../decorators/UserInfoDecorator';
import { Connection } from '../../../../models/Connection';
import { SearchService } from '../../../../components/services/SearchService';
import { SearchResultDto } from '../../../../models/dto/SearchResultDto';
import { ToolingService } from '../../../../components/services/ToolingService';

@Controller('api/metadata/search')
export class SearchController {

	@Get('/identifier')
	async searchByIdentifier(@UserInfo() connection: Connection, @Query('q') identifier: string) : Promise<SearchResultDto[]> {
		const toolingService = new ToolingService(connection);
		const service = new SearchService(connection, toolingService);
		return await service.searchByIdentifier(identifier);
	}

}
