import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { UpsertBuildingDto } from './dtos/upsert-building.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.schema';

@Controller('buildings')
export class BuildingsController {
  public constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  public create(
    @Body() createBuilding: UpsertBuildingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.buildingsService.create(createBuilding, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public udpate(
    @Param('id') id: string,
    @Body() createBuilding: UpsertBuildingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.buildingsService.update(id, createBuilding, user);
  }
}
