/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { RagModule } from './rag/rag.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), SupabaseModule, RagModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }