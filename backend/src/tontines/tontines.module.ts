import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tontine } from './entities/tontine.entity';
import { TontineMember } from './entities/tontine-member.entity';
import { TontinesService } from './tontines.service';
import { TontinesController } from './tontines.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tontine, TontineMember])],
  providers: [TontinesService],
  controllers: [TontinesController],
  exports: [TontinesService],
})
export class TontinesModule {}
