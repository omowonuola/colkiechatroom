import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { UserEntity } from './user/model/users.entity';
import { RoomsController } from './Rooms/rooms.controller';
import { RoomsService } from './rooms/rooms.service';
import { RoomsModule } from './rooms/rooms.module';
import { RoomEntity } from './Rooms/model/rooms/rooms.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      // validationSchema: configValidationSchema,
    }),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [UserEntity, RoomEntity],
        synchronize: true,
      }),
    }),
    RoomsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class AppModule {}
