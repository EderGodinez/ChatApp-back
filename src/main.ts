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
    const PORT:number=parseInt(process.env.PORT)||3001
    await app.listen(PORT);
}
bootstrap();
