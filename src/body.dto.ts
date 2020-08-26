import { IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BodyDTO {
  @IsString()
  name: string;

  @IsPositive()
  @Type(() => Number)
  value: number;
}
