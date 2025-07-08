import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Redis from 'ioredis';
import {
  Notification,
  NotificationDocument,
} from 'src/schemas/notification.schema';
import { WebsocketService } from 'src/websocket/websocket.service';

@Injectable()
export class NotificationRedisService implements OnModuleInit {
  constructor(
    @Inject('REDIS_SUB') private readonly redisSub: Redis,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly websocketService: WebsocketService,
  ) {}

  async onModuleInit() {
    await this.redisSub.subscribe('notifications');
    this.redisSub.on('message', this.handleMessage.bind(this));
  }

  private async handleMessage(channel: string, message: string) {
    try {
      const data = JSON.parse(message); // expect { userId: '', message: '' }

      await this.notificationModel.create({
        userId: data.userId,
        message: data.message,
      });
      this.websocketService.notifyUser(
        data.clientId,
        'New matching candidate added',
      );
      console.log('✅ Notification saved to DB');
    } catch (err) {
      console.error('❌ Failed to process message:', err);
    }
  }
}
