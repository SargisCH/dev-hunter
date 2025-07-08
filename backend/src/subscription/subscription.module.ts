import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CacheModule } from 'src/cache/cache.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationRedisModule } from '../notificationRedisModule/notification-redis.module';
import {
  Subscription,
  SubscriptionSchema,
} from 'src/schemas/subscription.schema';

@Module({
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  imports: [
    CacheModule,
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    forwardRef(() => CandidateModule),
    NotificationRedisModule,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
