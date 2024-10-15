import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type PageDto } from '../../common/dto/page.dto';
import { generatePinCode, validateHash } from '../../common/utils';
import { UserStatusEnum } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { RedisService } from '../../shared/services/redis.service';
import { type UserLoginDto } from '../auth/dto/user-login.dto';
import { type UserRegisterDto } from '../auth/dto/user-register.dto';
import { EmailService } from '../email/email.service';
import { type UpdateUserDto } from './dtos/update-user.dto';
import { type UserDto } from './dtos/user.dto';
import { type UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { InvalidPinException } from './exceptions/invalid-pin.excaption';
import { UserAlreadyVerifiedException } from './exceptions/user-already-verified.exceptions';
import { UserUnverifiedException } from './exceptions/user-unverified.excaption';
import { UserEntity } from './friend-request.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private redisService: RedisService,
  ) {}

  async findAuth(id: Uuid): Promise<UserDto | undefined> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return userEntity?.toDto();
  }

  async login(userLoginDto: UserLoginDto): Promise<UserDto> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: userLoginDto.email })
      .getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    if (userEntity.status === UserStatusEnum.UNVERIFIED) {
      throw new UserUnverifiedException();
    }

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      userEntity.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async create(userRegisterDto: UserRegisterDto): Promise<void> {
    await this.checkEmail(userRegisterDto.email);

    const userEntity = this.userRepository.create({
      ...userRegisterDto,
    });

    await this.userRepository.save(userEntity);

    const pin = generatePinCode();

    await this.redisService.savePin(userRegisterDto.email, pin);

    await this.emailService.sendVerificationEmail(userRegisterDto.email, pin);
  }

  async verify(email: string, pin: string): Promise<UserDto> {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    const isValidPin = await this.redisService.checkPin(email, pin);

    if (!isValidPin) {
      throw new InvalidPinException();
    }

    if (userEntity.status === UserStatusEnum.VERIFIED) {
      throw new UserAlreadyVerifiedException();
    }

    userEntity.status = UserStatusEnum.VERIFIED;

    await this.userRepository.save(userEntity);

    await this.redisService.removePin(email);

    return userEntity.toDto();
  }

  async getAll(
    userPageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (userPageOptionsDto.age) {
      queryBuilder.andWhere('user.age = :age', { age: userPageOptionsDto.age });
    }

    if (userPageOptionsDto.q) {
      queryBuilder.searchByString(
        userPageOptionsDto.q,
        ['user.firstName', 'user.lastName'],
        {
          formStart: true,
        },
      );
    }

    const [items, pageMetaDto] = await queryBuilder
      .orderBy('user.createdAt', userPageOptionsDto.order)
      .paginate(userPageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getOne(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  async update(id: Uuid, updateUserDto: UpdateUserDto): Promise<void> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    this.userRepository.merge(userEntity, updateUserDto);

    await this.userRepository.save(userEntity);
  }

  private async checkEmail(email: string) {
    const userEntity = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    if (userEntity) {
      throw new BadRequestException();
    }
  }
}
