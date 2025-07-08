import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateModule } from './candidate/candidate.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CacheModule } from './cache/cache.module';
import { WebsocketModule } from './websocket/websocket.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('DATABASE_URI'),
        };
      },
      inject: [ConfigService],
    }),
    CacheModule,
    CandidateModule,
    SubscriptionModule,
    CacheModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
