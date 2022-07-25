import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import { plainToInstance } from 'class-transformer';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(authUserDto: AuthUserDto) {
    //- See if email is in use
    const { email, password } = authUserDto;
    let user = await this.usersService.findOneByEmail(email);
    if (user) {
      throw new BadRequestException('Email in use');
    }

    //- Hash the users password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    //- Create a new user and save it
    const createUserDto = plainToInstance(CreateUserDto, {
      email,
      password: result,
    });
    user = await this.usersService.create(createUserDto);

    //- return the user
    return user;
  }
}
