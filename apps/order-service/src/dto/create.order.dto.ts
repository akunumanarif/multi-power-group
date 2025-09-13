import { IsArray, ArrayNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  orderId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  itemId: string[];
}
