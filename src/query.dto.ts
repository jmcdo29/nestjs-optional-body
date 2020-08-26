import { IsString } from 'class-validator';

export class QueryDTO {
  @IsString()
  q: string;
}