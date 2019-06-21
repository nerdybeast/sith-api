import { Module } from '@nestjs/common';
import { ToolingModule } from './tooling/tooling-module';
import { MetadataModule } from './metadata/metadata-module';
import { SobjectsModule } from './sobjects/sobjects-module';

@Module({
	imports: [ ToolingModule, SobjectsModule, MetadataModule ]
})
export class ApiModule {}