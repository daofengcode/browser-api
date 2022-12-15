import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrowserModule } from './modules/browser/browser.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), BrowserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
