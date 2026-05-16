import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Badge } from './entities/badge.entity';

@Injectable()
export class GamificationService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Badge)
    private badgesRepository: Repository<Badge>,
  ) {}

  async onModuleInit() {
    await this.seedBadges();
  }

  private async seedBadges() {
    const defaultBadges = [
      { code: 'FIRST_STEPS', name: 'First Steps', description: 'Added your first transaction', icon: 'Footprints' },
      { code: 'SAVER_10', name: 'Disciplined Saver', description: 'Maintained a 10% savings rate', icon: 'PiggyBank' },
      { code: 'SAVER_20', name: 'Master Saver', description: 'Maintained a 20% savings rate', icon: 'Wallet' },
      { code: 'GOLDEN_RULE', name: 'The First Law', description: 'Followed the rule: "A part of all you earn is yours to keep"', icon: 'Coins' },
    ];

    for (const badgeData of defaultBadges) {
      const exists = await this.badgesRepository.findOne({ where: { code: badgeData.code } });
      if (!exists) {
        await this.badgesRepository.save(this.badgesRepository.create(badgeData));
      }
    }
  }

  async addXP(userId: number, amount: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return;

    user.xp += amount;

    // Level up logic: 100 XP per level
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }

    await this.usersRepository.save(user);
    return { xp: user.xp, level: user.level };
  }

  async checkAndAwardBadges(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['badges', 'transactions']
    });
    if (!user) return;

    const awardedBadges: Badge[] = [...user.badges];
    const userBadgeCodes = new Set(user.badges.map(b => b.code));

    // Badge: FIRST_STEPS
    if (!userBadgeCodes.has('FIRST_STEPS') && user.transactions.length > 0) {
      const badge = await this.badgesRepository.findOne({ where: { code: 'FIRST_STEPS' } });
      if (badge) awardedBadges.push(badge);
    }

    // Badge: SAVER_10 & GOLDEN_RULE
    if (user.savingsRate >= 10) {
      if (!userBadgeCodes.has('SAVER_10')) {
        const badge = await this.badgesRepository.findOne({ where: { code: 'SAVER_10' } });
        if (badge) awardedBadges.push(badge);
      }
      if (!userBadgeCodes.has('GOLDEN_RULE')) {
        const badge = await this.badgesRepository.findOne({ where: { code: 'GOLDEN_RULE' } });
        if (badge) awardedBadges.push(badge);
      }
    }

    // Badge: SAVER_20
    if (user.savingsRate >= 20 && !userBadgeCodes.has('SAVER_20')) {
      const badge = await this.badgesRepository.findOne({ where: { code: 'SAVER_20' } });
      if (badge) awardedBadges.push(badge);
    }

    if (awardedBadges.length > user.badges.length) {
      user.badges = awardedBadges;
      await this.usersRepository.save(user);
    }

    return user.badges;
  }

  async getProgress(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['badges']
    });
    if (!user) throw new Error('User not found');

    return {
      level: user.level,
      xp: user.xp,
      xpToNextLevel: (user.level * 100) - user.xp,
      badges: user.badges
    };
  }
}
