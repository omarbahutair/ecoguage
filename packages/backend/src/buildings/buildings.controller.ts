import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { UpsertBuildingDto } from './dtos/upsert-building.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.schema';
import { PaginationDto } from 'src/util/dtos/pagination.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BuildingDto } from './dtos/building.dto';
import { BuildingsFilterDto } from './dtos/buildings-filter.dto';

@Controller('buildings')
@Serialize(BuildingDto)
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

  @Get(':id')
  @UseGuards(AuthGuard)
  public findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.buildingsService.findOne(id, user);
  }

  @Get()
  @UseGuards(AuthGuard)
  public find(
    @Query() filter: BuildingsFilterDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.buildingsService.find(filter, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public delete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.buildingsService.delete(id, user);
  }
}
