import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ManageDeletedBuildingsService } from './manage-deleted-buildings.service';
import { BuildingDocument } from './building.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.schema';
import { BuildingsFilterDto } from './dtos/buildings-filter.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BuildingDto } from './dtos/building.dto';

@Controller('manage-deleted-buildings')
@Serialize(BuildingDto)
export class ManageDeletedBuildingsController {
  public constructor(
    private readonly manageDeletedBuildingsService: ManageDeletedBuildingsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  public findDeleted(
    @Query() filter: BuildingsFilterDto,
    @CurrentUser() user: UserDocument,
  ): Promise<PaginatedResponse<BuildingDocument>> {
    return this.manageDeletedBuildingsService.findDeleted(filter, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public recoverDeleted(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<BuildingDocument> {
    return this.manageDeletedBuildingsService.recoverDeleted(id, user);
  }
}
