import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto, CreateOrderItemDto, CreateOrderFileDto, CreateOrderTimelineDto } from './create-order.dto';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderFileDto)
  files?: CreateOrderFileDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderTimelineDto)
  timeline?: CreateOrderTimelineDto[];
}
