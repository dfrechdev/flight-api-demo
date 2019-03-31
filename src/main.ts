import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Demo Flight API')
    .setDescription(
      'Proxy API with offline capability for the Schipol Flight API located at https://developer.schiphol.nl/apis/flight-api/',
  )
    .setVersion('0.1')
    .setHost('localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
