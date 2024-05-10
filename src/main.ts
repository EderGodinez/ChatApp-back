/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  app.enableCors({origin:"*"})
    app.useGlobalPipes(new ValidationPipe());
    const config = new DocumentBuilder()
    .setTitle('Chat-API')
    .setDescription('API REST de sistema una red social')
    .setVersion('1.0')
    .addTag('Red social')
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const DEFAULT_PORT: number = 3001; // Puerto predeterminado si no se proporciona uno a través de process.env
    const PORT: number = process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : DEFAULT_PORT;
    await app.listen(PORT);
}
bootstrap();
