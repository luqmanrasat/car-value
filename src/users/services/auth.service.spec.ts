import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let users: User[];

  const mockAuthUserDto = {
    email: 'test@test.com',
    password: 'test123',
  };

  const mockUsersService = {
    findOneByEmail: jest.fn((email: string) => {
      const [user] = users.filter((user) => user.email === email);
      return Promise.resolve(user);
    }),
    create: jest.fn((createUserDto: CreateUserDto) => {
      const user = { ...createUserDto } as User;
      users.push(user);
      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    users = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw a bad request exception if user signs up with an email that is in use', async () => {
      await service.signup(mockAuthUserDto);
      await expect(service.signup(mockAuthUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should create a new user with a salted & hashed password', async () => {
      const user = await service.signup(mockAuthUserDto);
      expect(user).toBeDefined();
      expect(user.password).not.toEqual('test123');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });
  });

  describe('signin', () => {
    it('should throw a NotFoundException if user signs in with an unused email', async () => {
      await expect(service.signin(mockAuthUserDto)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw a BadRequestException if an invalid password is provided', async () => {
      await service.signup(mockAuthUserDto);
      await expect(
        service.signin({
          email: mockAuthUserDto.email,
          password: 'differentPassword',
        }),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should return a user if correct password is provided', async () => {
      await service.signup(mockAuthUserDto);
      const user = await service.signin(mockAuthUserDto);
      expect(user).toBeDefined;
    });
  });
});
