import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  const mockUser = {
    email: 'test@test.com',
    password: 'test123',
  };

  const mockSession = {
    userId: null,
  }

  const mockUsersService = {
    findOneById: jest.fn((id: number) =>
      Promise.resolve({ ...mockUser, id } as User),
    ),
    find: jest.fn(() => Promise.resolve(users)),
    update: jest.fn((id: number, updateUserDto: UpdateUserDto) =>
      Promise.resolve({
        id,
        ...mockUser,
        ...updateUserDto,
      } as User),
    ),
    remove: jest.fn((id: number) =>
      Promise.resolve({
        id,
        ...mockUser,
      } as User),
    ),
  };

  const mockAuthService = {
    signup: jest.fn((authUserDto: AuthUserDto) => {
      const user = authUserDto as User;
      users.push(user);
      return Promise.resolve(user);
    }),
    signin: jest.fn(),
  };
  
  let controller: UsersController;
  let users: User[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUsers()', () => {
    it('should return an array of users', async () => {
      await controller.createUser(mockUser, mockSession);
      const result = await controller.findUsers();
      expect(result.length).toEqual(1);
    })
  });

  describe('findUser()', () => {
    it('should throw a NotFoundException if user does not exist', async () => {
      mockUsersService.findOneById.mockResolvedValueOnce(null);
      await expect(controller.findUser(1)).rejects.toThrowError(NotFoundException);
    })

    it('should return user with the given id', async () => {
      await controller.createUser(mockUser, mockSession);
      const result = await controller.findUser(420);
      expect(result.id).toEqual(420);
    })
  });
});
