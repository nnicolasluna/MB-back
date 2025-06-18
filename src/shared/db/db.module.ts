import { Global, Module } from '@nestjs/common';
import { DBConnection } from './prisma';
import { SimplePrismaService } from './prisma.simple';

@Global()
@Module({
	providers: [DBConnection, SimplePrismaService],
	exports: [DBConnection, SimplePrismaService],
})
export class DbModule {}
