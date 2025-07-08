import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema()
export class Subscription {
  @Prop()
  skills?: string[];

  @Prop()
  skillsKey?: string;

  @Prop()
  experience?: string;

  @Prop()
  position?: string;

  @Prop()
  minSalary?: number;

  @Prop()
  maxSalary?: number;

  @Prop()
  clientId: string;

  @Prop()
  totalCandidates: number;

  @Prop()
  newCandidates: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
