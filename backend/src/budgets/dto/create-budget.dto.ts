import { IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  category: string;

  @IsNumber()
  @Min(1)
  monthlyLimit: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Min(2020)
  year: number;
}