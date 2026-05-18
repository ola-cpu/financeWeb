import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { TontinesService } from './tontines.service';
import { Tontine } from './entities/tontine.entity';
import { TontineMember } from './entities/tontine-member.entity';

@Controller('tontines')
export class TontinesController {
  constructor(private readonly tontinesService: TontinesService) {}

  @Post()
  create(@Body() tontineData: Partial<Tontine>) {
    return this.tontinesService.create(tontineData);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.tontinesService.findAllByUserId(+userId);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() memberData: Partial<TontineMember>) {
    return this.tontinesService.addMember(+id, memberData);
  }

  @Get(':id/next-beneficiary')
  getNextBeneficiary(@Param('id') id: string) {
    return this.tontinesService.getNextBeneficiary(+id);
  }

  @Post('members/:memberId/payout')
  markPayoutDone(@Param('memberId') memberId: string) {
    return this.tontinesService.markPayoutDone(+memberId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() tontineData: Partial<Tontine>) {
    return this.tontinesService.update(+id, tontineData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tontinesService.remove(+id);
  }
}
