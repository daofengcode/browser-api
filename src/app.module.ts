import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrowserModule } from './modules/browser/browser.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot(), BrowserModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public')
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
