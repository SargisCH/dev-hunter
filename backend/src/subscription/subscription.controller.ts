import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import Redis from 'ioredis';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './subscription.dto';
import { CacheService } from '../cache/cache.service';
import { CandidateService } from 'src/candidate/candidate.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private subscriptionService: SubscriptionService,
    private candidateService: CandidateService,
    private cacheService: CacheService,
  ) {}

  @Get('/')
  getSubscriptions(@Headers('x-client-id') clientId: string) {
    return this.subscriptionService.findAll(clientId);
  }

  @Get(':id/candidates')
  async getSubscriptionCandidates(
    @Param() params: { id: string },
    @Headers('x-client-id') clientId: string,
  ) {
    const cacheKey = `${clientId}-${params.id}`;
    const candidates = (await this.cacheService.get(cacheKey)) as Array<
      Partial<{ _id: string; new: false }>
    >;
    const newCandidates = candidates.map(
      (c: Partial<{ _id: string; new?: boolean }>) => {
        if (c?.new) {
          return { ...c, new: undefined };
        }
        return c;
      },
    );
    await Promise.all([
      this.cacheService.set(cacheKey, newCandidates),
      await this.subscriptionService.updateSubscription(params.id, {
        newCandidates: 0,
      }),
    ]);
    return candidates;
  }

  @Post('create')
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Headers('x-client-id') clientId: string,
  ) {
    const noFiltersSelected =
      !createSubscriptionDto?.skills?.length &&
      !createSubscriptionDto.experience &&
      !createSubscriptionDto.position &&
      !createSubscriptionDto.minSalary &&
      !createSubscriptionDto.maxSalary;
    if (noFiltersSelected) {
      throw new BadRequestException(
        'No filters selected: Select at least one filter',
      );
    }
    const subscription = await this.subscriptionService.createSubscription(
      createSubscriptionDto,
      clientId,
    );

    const cacheKey = `${clientId}-${subscription._id.toString()}`;
    const subscriptionObject = {
      ...subscription.toObject(),
      _id: subscription._id.toString(),
    };
    const { candidates } =
      await this.candidateService.getCandidatesBySubscriptionFilter(
        subscriptionObject,
        cacheKey,
      );
    return subscription;
  }
  @Post(':id/candidates/add')
  async addCandidatesForSubscription(
    @Param() params: { id: string },
    @Headers('x-client-id') clientId: string,
  ) {
    const cacheKey = `${clientId}-${params.id.toString()}`;
    const subscription = await this.subscriptionService.findOne(
      params.id.toString(),
    );
    if (!subscription) {
      throw new NotFoundException('Subscription is not found');
    }
    await this.candidateService.addCandidatesDorSubscription({
      skills: subscription.skills,
      experience: subscription.experience,
      minSalary: subscription?.minSalary,
      maxSalary: subscription?.maxSalary,
      position: subscription?.position,
    });
    const subscriptionObject = {
      ...subscription.toObject(),
      _id: subscription._id.toString(),
    };
    const { candidates } =
      await this.candidateService.getCandidatesBySubscriptionFilter(
        subscriptionObject,
        cacheKey,
      );

    const pub = new Redis();

    await pub.publish(
      'notifications',
      JSON.stringify({
        clientId: clientId,
        message: 'You have a new candidate matching!',
      }),
    );
    return candidates || [];
  }
}
