import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumoAguaModule } from './consumo_agua/consumo_agua.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConsumoAguaModule, MongooseModule.forRoot('mongodb+srv://cainan:159753@cadastro.wkwejwr.mongodb.net/agua?retryWrites=true&w=majority&appName=Cadastro')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
