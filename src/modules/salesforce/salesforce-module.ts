import { Module } from '@nestjs/common';
import { SalesforceController } from './salesforce-controller';

@Module({
	controllers: [SalesforceController]
})
export class SalesforceModule {}