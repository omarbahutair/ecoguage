import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dtos/create-building.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserDocument } from 'src/users/user.schema';

@Controller('buildings')
export class BuildingsController {
  public constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  public create(
    @Body() createBuilding: CreateBuildingDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.buildingsService.create(createBuilding, user);
  }
}
