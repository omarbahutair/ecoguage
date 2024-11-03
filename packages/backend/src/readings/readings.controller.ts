import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.schema';
import { UpsertReadingDto } from './dtos/upsert-reading.dto';

@Controller('readings')
export class ReadingsController {
  public constructor(private readonly readingsServices: ReadingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  public create(
    @Body() createReading: UpsertReadingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.readingsServices.create(createReading, user);
  }
}
