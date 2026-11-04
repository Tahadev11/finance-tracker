import { IsNumber, Min } from 'class-validator';

export class ContributeDto {
  @IsNumber()
  @Min(1)
  amount: number;
}