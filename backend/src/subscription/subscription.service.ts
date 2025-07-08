import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './subscription.dto';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from 'src/schemas/subscription.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}
  async createSubscription(
    createSubscription: CreateSubscriptionDto,
    clientId: string,
  ) {
    const subscription = await this.subscriptionModel.insertOne({
      ...createSubscription,
      clientId: clientId,
      skillsKey: [...(createSubscription.skills || [])].sort().join(','),
    });
    return subscription;
  }
  findAll(clientId: string) {
    return this.subscriptionModel.find({ clientId });
  }
  findOne(id: string) {
    return this.subscriptionModel.findOne({ _id: new ObjectId(id) });
  }
  updateSubscription(
    id: string,
    subscription: Partial<{ totalCandidates: number; newCandidates: number }>,
  ) {
    return this.subscriptionModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      subscription,
    );
  }
}
