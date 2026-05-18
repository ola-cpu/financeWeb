import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tontine } from './entities/tontine.entity';
import { TontineMember } from './entities/tontine-member.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TontinesService {
  constructor(
    @InjectRepository(Tontine)
    private tontineRepository: Repository<Tontine>,
    @InjectRepository(TontineMember)
    private tontineMemberRepository: Repository<TontineMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(tontineData: Partial<Tontine>): Promise<Tontine> {
    if (tontineData.creator) {
      const userId = typeof tontineData.creator === 'number' ? tontineData.creator : tontineData.creator.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }
    }
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
    if (!tontine) {
      throw new NotFoundException(`Tontine with ID ${tontineId} not found`);
    }

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

  async markPayoutDone(memberId: number): Promise<TontineMember> {
    const member = await this.tontineMemberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException(`Tontine member with ID ${memberId} not found`);
    }
    await this.tontineMemberRepository.update(memberId, { hasReceivedPayout: true });
    const updated = await this.tontineMemberRepository.findOne({ where: { id: memberId } });
    if (!updated) {
      throw new NotFoundException(`Tontine member with ID ${memberId} not found after update`);
    }
    return updated;
  }

  async update(id: number, tontineData: Partial<Tontine>): Promise<Tontine> {
    const tontine = await this.tontineRepository.findOne({ where: { id } });
    if (!tontine) {
      throw new NotFoundException(`Tontine with ID ${id} not found`);
    }
    if (tontineData.creator) {
      const userId = typeof tontineData.creator === 'number' ? tontineData.creator : tontineData.creator.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }
    }
    await this.tontineRepository.update(id, tontineData);
    const updated = await this.tontineRepository.findOne({ where: { id }, relations: ['members'] });
    if (!updated) {
      throw new NotFoundException(`Tontine with ID ${id} not found after update`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const tontine = await this.tontineRepository.findOne({ where: { id } });
    if (!tontine) {
      throw new NotFoundException(`Tontine with ID ${id} not found`);
    }
    await this.tontineRepository.delete(id);
  }
}
