# Optional Body

So, normally I will never condone something like this, as it gets difficult to read and know what the custom decorators do.
With that being said, it is absolutely possible to make use of `@Type()`, `@ValidateNested()`, and `@ValidateIf()` from
`class-validator` and `class-transformer` and make a DTO validate the Body if and only if a query value is as expected.

## The Idea

Validate that the body of a POST request exists if the query parameter `q` is equal to `foo`. 

## The Execution

We create 3 DTOs for this, a `BodyDTO`, a `QueryDTO` and a `MixedDTO` (you can call this what you want).

```typescript
import { IsString } from 'class-validator';

export class QueryDTO {
  @IsString()
  q: string;
}
```

```typescript
import { IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BodyDTO {
  @IsString()
  name: string;

  @IsPositive()
  @Type(() => Number)
  value: number;
}
```

```typescript
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
```

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Mixed } from './mixed.decorator';
import { MixedDTO } from './mixed.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('optionals')
  postOptionals(@Mixed() mixedBodyAndQuery: MixedDTO): string {
    console.log(mixedBodyAndQuery);
    return 'all good';
  }
}
```

## The Outcome

By using `curl` we can test our setup.

```sh
▶ curl http://localhost:3000/optionals\?q\=something -d ''
all good
```

```sh
▶ curl http://localhost:3000/optionals\?q\=foo -d '' 
{"statusCode":400,"message":["body.name must be a string","body.value must be a positive number"],"error":"Bad Request"
```

```sh
▶ curl http://localhost:3000/optionals\?q\=foo -d '' 
{"statusCode":400,"message":["body.name must be a string","body.value must be a positive number"],"error":"Bad Request"
```