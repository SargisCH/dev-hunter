import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationRedisService } from './notification-redis.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from 'src/schemas/notification.schema';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    WebsocketModule,
  ],
  providers: [
    {
      provide: 'REDIS_SUB',
      useFactory: () => new Redis(),
    },
    NotificationRedisService,
  ],
})
export class NotificationRedisModule {}
