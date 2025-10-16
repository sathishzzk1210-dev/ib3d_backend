import { 
  IsString, IsOptional, IsEnum, IsArray, ValidateNested, 
  IsInt, Min, IsDateString 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../entities/order.entity';

// ---------- Order Item ----------
export class CreateOrderItemDto {
  @ApiProperty({ example: 'part-001.stl' })
  @IsString()
  fileName: string;

  @ApiPropertyOptional({ example: 'PLA' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ example: 'Red' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 1500 })
  @IsInt()
  @Min(0)
  price: number;
}

// ---------- Order File ----------
export class CreateOrderFileDto {
  @ApiProperty({ example: 'invoice.pdf' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '2MB' })
  @IsOptional()
  @IsString()
  size?: string;
}

// ---------- Order Timeline ----------
export class CreateOrderTimelineDto {
  @ApiPropertyOptional({ example: '2025-09-25T10:30:00Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 'PROCESSING' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ example: 'Order confirmed by admin' })
  @IsOptional()
  @IsString()
  note?: string;
}

// ---------- Main CreateOrder ----------
export class CreateOrderDto {
  @ApiProperty({ example: 'ORD-20250925-001' })
  @IsString()
  externalId: string;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.IN_REVIEW })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ example: 3000 })
  @IsInt()
  @Min(0)
  total: number;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: '2025-10-05' })
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @ApiPropertyOptional({ type: [CreateOrderItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];

  @ApiPropertyOptional({ type: [CreateOrderFileDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderFileDto)
  files?: CreateOrderFileDto[];

  @ApiPropertyOptional({ type: [CreateOrderTimelineDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderTimelineDto)
  timeline?: CreateOrderTimelineDto[];

  @ApiPropertyOptional({ example: 'Standard Shipping' })
  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @ApiPropertyOptional({ example: 'TRACK123456' })
  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
