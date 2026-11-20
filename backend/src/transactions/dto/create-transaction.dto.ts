import { IsEnum, IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'])
  type: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  category: string;

  @IsDateString()
  date: string;

  @IsEnum(['cash', 'card', 'bank_transfer', 'mobile_wallet'])
  paymentMethod: string;

  @IsOptional()
  @IsString()
  description?: string;
}