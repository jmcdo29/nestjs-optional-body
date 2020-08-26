import { Type } from 'class-transformer';
import { ValidateIf, ValidateNested } from 'class-validator';
import { BodyDTO } from './body.dto';
import { QueryDTO } from './query.dto';

export class MixedDTO {
  @Type(() => QueryDTO)
  @ValidateNested()
  query: QueryDTO;

  @Type(() => BodyDTO)
  @ValidateNested()
  @ValidateIf(o => o.query.q === 'foo')
  body: BodyDTO;
}
