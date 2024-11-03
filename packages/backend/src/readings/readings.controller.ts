import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.schema';
import { UpsertReadingDto } from './dtos/upsert-reading.dto';
import { FilterReadingsDto } from './dtos/filter-readings.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReadingDto } from './dtos/reading.dto';

@Controller('readings')
@Serialize(ReadingDto)
@UseGuards(AuthGuard)
export class ReadingsController {
  public constructor(private readonly readingsServices: ReadingsService) {}

  @Post()
  public create(
    @Body() createReading: UpsertReadingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.readingsServices.create(createReading, user);
  }

  @Get()
  public find(
    @Query() filter: FilterReadingsDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.readingsServices.find(filter, user);
  }
}
