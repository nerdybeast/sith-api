import { Module, NestModule, MiddlewaresConsumer } from '@nestjs/common';
import { ConnectionDetailsMiddleware } from '../../middleware/ConnectionDetailsMiddleware';
import { ToolingModule } from './tooling/tooling-module';
import { MetadataModule } from './metadata/metadata-module';
import { SobjectsModule } from './sobjects/sobjects-module';

@Module({
	modules: [ ToolingModule, SobjectsModule, MetadataModule ]
})
export class ApiModule {}