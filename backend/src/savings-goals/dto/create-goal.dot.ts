import { IsNumber, IsString, IsDateString, Min } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  targetAmount: number;

  @IsDateString()
  targetDate: string;
}