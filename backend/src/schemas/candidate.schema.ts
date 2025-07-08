import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CandidateDocument = HydratedDocument<Candidate>;

@Schema()
export class Candidate {
  @Prop()
  name: string;

  @Prop()
  experience: string;

  @Prop()
  skills: string[];

  @Prop()
  position: string;

  @Prop()
  salary: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
