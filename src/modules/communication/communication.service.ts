import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type PageDto } from '../../common/dto/page.dto';
import { CommunicationStatusEnum } from '../../constants';
import { CommunicationEntity } from './communication.entity';
import { type CommunicationDto } from './dtos/communication.dto';
import { type CommunicationPageOptionsDto } from './dtos/communication-page-options.dto';
import { AlreadyFollowingException } from './exceptions/already-following.exception';
import { CommunicationNotFoundException } from './exceptions/communication-not-found.exceptions';
import { FollowRequestAlreadySentException } from './exceptions/follow-request-already-sent.exception';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(CommunicationEntity)
    private communicationRepository: Repository<CommunicationEntity>,
  ) {}

  async sendFollowRequest(
    senderId: Uuid,
    recipientId: Uuid,
  ): Promise<CommunicationDto> {
    await this.checkFollowRequest(senderId, recipientId);

    const communicationEntity = this.communicationRepository.create({
      followerId: senderId,
      followingId: recipientId,
    });

    await this.communicationRepository.save(communicationEntity);

    return communicationEntity.toDto();
  }

  async respondToFollowRequest(
    communicationId: Uuid,
    userId: Uuid,
    accept: boolean,
  ) {
    const communicationEntity = await this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.id = :id', { id: communicationId })
      .andWhere('communication.followingId = :followingId', {
        followingId: userId,
      })
      .andWhere('communication.status = :status', {
        status: CommunicationStatusEnum.PENDING,
      })
      .getOne();

    if (!communicationEntity) {
      throw new CommunicationNotFoundException();
    }

    communicationEntity.status = accept
      ? CommunicationStatusEnum.ACCEPTED
      : CommunicationStatusEnum.DECLINED;

    await this.communicationRepository.save(communicationEntity);
  }

  async getMyFollows(
    communicationPageOptionsDto: CommunicationPageOptionsDto,
    userId: Uuid,
  ): Promise<PageDto<CommunicationDto>> {
    const queryBuilder = this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.followingId = :followingId', {
        followingId: userId,
      })
      .leftJoinAndSelect('communication.follower', 'follower')
      .leftJoinAndSelect('communication.following', 'following');

    if (communicationPageOptionsDto.status) {
      queryBuilder.andWhere('communication.status = :status', {
        status: communicationPageOptionsDto.status,
      });
    }

    const [items, pageMetaDto] = await queryBuilder
      .orderBy('communication.createdAt', communicationPageOptionsDto.order)
      .paginate(communicationPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getOne(communicationId: Uuid, userId: Uuid): Promise<CommunicationDto> {
    const communicationEntity = await this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.id = :communicationId', { communicationId })
      .where('communication.followingId = :followingId', {
        followingId: userId,
      })
      .getOne();

    if (!communicationEntity) {
      throw new CommunicationNotFoundException();
    }

    return communicationEntity.toDto();
  }

  private async checkFollowRequest(senderId: Uuid, recipientId: Uuid) {
    const queryBuilder = this.communicationRepository
      .createQueryBuilder('communication')
      .where('communication.followerId = :senderId', { senderId })
      .andWhere('communication.followingId = :recipientId', { recipientId });

    const isAlreadySent = await queryBuilder
      .andWhere('communication.status = :status', {
        status: CommunicationStatusEnum.PENDING,
      })
      .getOne();

    if (isAlreadySent) {
      throw new FollowRequestAlreadySentException();
    }

    const isAlreadyFollowing = await queryBuilder
      .andWhere('communication.status = :status', {
        status: CommunicationStatusEnum.ACCEPTED,
      })
      .getOne();

    if (isAlreadyFollowing) {
      throw new AlreadyFollowingException();
    }
  }
}
