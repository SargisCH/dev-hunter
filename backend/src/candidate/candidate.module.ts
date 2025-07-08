import { forwardRef, Logger, Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CacheModule } from 'src/cache/cache.module';
import { MongooseModule } from '@nestjs/mongoose';

import { Candidate, CandidateSchema } from 'src/schemas/candidate.schema';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  controllers: [CandidateController],
  imports: [
    CacheModule,
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    forwardRef(() => SubscriptionModule),
  ],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}
