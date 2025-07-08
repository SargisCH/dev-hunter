import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  readonly experience: string;

  @IsArray()
  readonly skills?: string[];

  @IsString()
  readonly position?: string;

  @IsNumber()
  readonly minSalary?: number;

  @IsNumber()
  readonly maxSalary?: number;
}
