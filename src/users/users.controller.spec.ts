import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let users: User[];
  let mockSession: { userId: number };

  const mockAuthUserDto = {
    email: 'test@test.com',
    password: 'test123',
  };

  const mockUsersService = {
    findOneById: jest.fn((id: number) => {
      const [user] = users.filter((user) => user.id === id);
      return Promise.resolve(user);
    }),
    find: jest.fn(() => Promise.resolve(users)),
    update: jest.fn((id: number, updateUserDto: UpdateUserDto) => {
      let updatedUser: User;
      for (const user of users) {
        if (user.id === id) {
          for (const key in updateUserDto) {
            user[key] = updateUserDto[key];
          }
          updatedUser = user;
          break;
        }
      }
      return Promise.resolve(updatedUser);
    }),
    remove: jest.fn((id: number) => {
      let removedUser: User;
      for (const index in users) {
        if (users[index].id === id) {
          [removedUser] = users.splice(+index, 1);
          break;
        }
      }
      Promise.resolve(removedUser);
    }),
  };

  const mockAuthService = {
    signup: jest.fn((authUserDto: AuthUserDto) => {
      const user = { id: new Date().valueOf(), ...authUserDto } as User;
      users.push(user);
      return Promise.resolve(user);
    }),
    signin: jest.fn((authUserDto: AuthUserDto) => {
      const [user] = users.filter((user) => user.email === authUserDto.email);
      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    users = [];
    mockSession = { userId: null };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser()', () => {
    it('should save created user and return it', async () => {
      const user = await controller.createUser(mockAuthUserDto, mockSession);
      expect(user).toBeDefined();
      expect(users).toContainEqual(user);
    });
  });

  describe('signin()', () => {
    it('should save userId in session object', async () => {
      await controller.createUser(mockAuthUserDto, mockSession);
      const user = await controller.signin(mockAuthUserDto, mockSession);
      expect(mockSession.userId).toEqual(user.id);
    });
  });

  describe('signout()', () => {
    it('should clear userId in session object', async () => {
      await controller.createUser(mockAuthUserDto, mockSession);
      await controller.signin(mockAuthUserDto, mockSession);
      controller.signOut(mockSession);
      expect(mockSession.userId).toBeNull();
    });
  });

  describe('findUsers()', () => {
    it('should return an array of users', async () => {
      await controller.createUser(mockAuthUserDto, mockSession);
      const result = await controller.findUsers();
      expect(result.length).toEqual(1);
    });
  });

  describe('findUser()', () => {
    it('should throw a NotFoundException if user does not exist', async () => {
      await expect(controller.findUser(420)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return user with the given id', async () => {
      const user = await controller.createUser(mockAuthUserDto, mockSession);
      const result = await controller.findUser(user.id);
      expect(result.id).toEqual(user.id);
    });
  });

  describe('updateUser()', () => {
    it('should update the selected user with new value given', async () => {
      const user = await controller.createUser(mockAuthUserDto, mockSession);
      const result = await controller.updateUser(user.id, {
        email: 'newemail@test.com',
      });
      expect(users).toContainEqual(result);
    });
  });

  describe('deleteUser()', () => {
    it('should remove the selected user', async () => {
      const user = await controller.createUser(mockAuthUserDto, mockSession);
      await controller.deleteUser(user.id);
      expect(users).not.toContainEqual(user);
    });
  });
});
