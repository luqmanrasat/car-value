import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ): Promise<User> {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(
    @Body() authUserDto: AuthUserDto,
    @Session() session: Record<string, any>,
  ): Promise<User> {
    const user = await this.authService.signin(authUserDto);
    session.userId = user.id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: Record<string, any>): void {
    session.userId = null;
  }

  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = this.usersService.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  @Get()
  findUsers(): Promise<User[]> {
    return this.usersService.find();
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(id);
  }
}
