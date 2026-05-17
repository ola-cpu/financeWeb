import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tontine } from './entities/tontine.entity';
import { TontineMember } from './entities/tontine-member.entity';

@Injectable()
export class TontinesService {
  constructor(
    @InjectRepository(Tontine)
    private tontineRepository: Repository<Tontine>,
    @InjectRepository(TontineMember)
    private tontineMemberRepository: Repository<TontineMember>,
  ) {}

  async create(tontineData: Partial<Tontine>): Promise<Tontine> {
    const tontine = this.tontineRepository.create(tontineData);
    return this.tontineRepository.save(tontine);
  }

  async findAllByUserId(userId: number): Promise<Tontine[]> {
    return this.tontineRepository.find({
      where: { creator: { id: userId } },
      relations: ['members'],
    });
  }

  async addMember(tontineId: number, memberData: Partial<TontineMember>): Promise<TontineMember> {
    const tontine = await this.tontineRepository.findOne({ where: { id: tontineId }, relations: ['members'] });
    if (!tontine) throw new Error('Tontine not found');

    const member = this.tontineMemberRepository.create({
      ...memberData,
      tontine,
      position: tontine.members.length + 1,
    });
    return this.tontineMemberRepository.save(member);
  }

  async getNextBeneficiary(tontineId: number): Promise<TontineMember | null> {
    const members = await this.tontineMemberRepository.find({
      where: { tontine: { id: tontineId }, hasReceivedPayout: false },
      order: { position: 'ASC' },
    });
    return members.length > 0 ? members[0] : null;
  }

  async markPayoutDone(memberId: number): Promise<TontineMember | null> {
    await this.tontineMemberRepository.update(memberId, { hasReceivedPayout: true });
    return this.tontineMemberRepository.findOne({ where: { id: memberId } });
  }

  async remove(id: number): Promise<void> {
    await this.tontineRepository.delete(id);
  }
}
