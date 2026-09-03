/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureCors } from './configure-cors';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configureCors(app);

	await app.listen(process.env.PORT ?? 3002);
}
void bootstrap();