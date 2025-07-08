import { BadRequestException, Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CacheService } from 'src/cache/cache.service';
import { Candidate } from 'src/schemas/candidate.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionService } from 'src/subscription/subscription.service';
import Redis from 'ioredis';

@Injectable()
export class CandidateService {
  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: Model<Candidate>,
    private readonly cacheService: CacheService,
    private readonly subscriptionService: SubscriptionService,
  ) {}
  async generate(clientId: string, count = 50) {
    if (!clientId) {
      throw new BadRequestException('Client Id is not provided');
    }
    const experience = ['junior', 'mid', 'senior', 'principal'];
    const positions = ['fullstack', 'frontend', 'backend', 'db_engineer'];
    const skills = [
      'next',
      'react',
      'node',
      'remix',
      'vite',
      'nuxt',
      'vue',
      'svelte',
      'angular',
      'ember',
      'gatsby',
    ];
    const candidates = Array.from({ length: count }).map(() => ({
      name: faker.person.fullName(),
      skills: faker.helpers.arrayElements(skills, 3),
      experience: experience[faker.number.int({ min: 0, max: 3 })],
      position: positions[faker.number.int({ min: 0, max: 3 })],
      salary: faker.number.int({ min: 1000, max: 5000 }),
    }));
    await this.candidateModel.insertMany(candidates);
    const subscriptions = await this.subscriptionService.findAll(clientId);

    const promises = subscriptions.map((subscription) => {
      const subscriptionObject = {
        ...subscription.toObject(),
        _id: subscription._id.toString(),
      };
      const cacheKey = `${clientId}-${subscriptionObject._id}`;
      return this.getCandidatesBySubscriptionFilter(
        subscriptionObject,
        cacheKey,
      );
    });
    const res = await Promise.all(promises);
    if (res.some((r) => r.newCandidatesCount)) {
      const pub = new Redis();

      await pub.publish(
        'notifications',
        JSON.stringify({
          clientId: clientId,
          message: 'You have a new candidate matching!',
        }),
      );
    }

    return candidates || [];
  }

  async getCandidatesBySubscriptionFilter(
    subscription: {
      _id: string;
      skills?: string[];
      experience?: string;
      position?: string;
      minSalary?: number;
      maxSalary?: number;
    },
    cacheKey: string,
  ) {
    const filter: {
      skills?: {
        [key: string]: { [key: string]: string[] };
      };
      experience?: string;
      position?: string;
      salary?: {
        $gte?: number;
        $lte?: number;
      };
    } = {};

    if (subscription?.skills?.length) {
      filter.skills = { $elemMatch: { $in: subscription.skills } };
    }
    if (subscription.experience) {
      filter.experience = subscription.experience;
    }
    if (subscription.position) {
      filter.position = subscription.position;
    }
    if (
      (subscription.minSalary || 0) > 0 &&
      (subscription.maxSalary || 0) > 0
    ) {
      filter.salary = {
        $gte: subscription.minSalary,
        $lte: subscription.maxSalary,
      };
    }
    const cachedCandidates = (await this.cacheService.get(cacheKey)) as Array<
      Partial<{ _id: string }>
    >;
    const candidates = await this.candidateModel.find(filter);
    let newCandidatesCount = 0;
    const newCandidates = candidates.map((candidate) => {
      const candidateObject = candidate.toObject();
      if (
        !cachedCandidates?.find((cachedCandidate: Partial<{ _id: string }>) => {
          return cachedCandidate?._id?.toString() === candidate._id.toString();
        })
      ) {
        newCandidatesCount += 1;
        return {
          ...candidateObject,
          _id: candidateObject?._id?.toString(),
          new: true,
        };
      }
      return {
        ...candidateObject,
        _id: candidate._id.toString(),
        new: undefined,
      };
    });
    await Promise.all([
      this.cacheService.set(cacheKey, newCandidates),
      this.subscriptionService.updateSubscription(subscription._id, {
        totalCandidates: newCandidates.length,
        newCandidates: newCandidatesCount,
      }),
    ]);
    return {
      candidates: newCandidates,
      newCandidatesCount,
    };
  }
  addCandidatesDorSubscription({
    skills,
    experience,
    position,
    minSalary,
    maxSalary,
  }: {
    skills?: string[];
    experience?: string;
    minSalary?: number;
    maxSalary?: number;
    position?: string;
  }) {
    const candidates = Array.from({ length: 5 }).map(() => ({
      name: faker.person.fullName(),
      skills,
      experience,
      position,
      salary: faker.number.int({ min: minSalary, max: maxSalary }),
    }));
    return this.candidateModel.insertMany(candidates);
  }
}
