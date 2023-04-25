import { Module } from '@nestjs/common';
import 'reflect-metadata';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
    }),
    UsersModule,
    RoomsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
