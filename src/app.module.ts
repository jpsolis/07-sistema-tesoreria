import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule } from './common/common.module';
import { join } from 'path';



@Module({
  imports: [
     TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Mon.chi2020.2025',
      database: 'db_sistema_tesoreria',
      entities: [User],
      autoLoadEntities: true,
    
      /* Warning Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.*/
      synchronize: true, 
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public'),
    }),

   
    CommonModule,

   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
