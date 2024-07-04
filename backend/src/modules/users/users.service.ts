import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { HttpException, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<Partial<Users>> {
    try {
      const { password } = createUserDto;

      const id = crypto.randomUUID();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        ...createUserDto,
        id,
        password: hashedPassword,
      };

      const finalUserCreated = this.usersRepository.create(user);
      await this.usersRepository.save(finalUserCreated);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  async getUserById(id: string): Promise<Users> {
    return await this.usersRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<Users | undefined> {
    return await this.usersRepository.findByEmail(email);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id);

    if (!user) throw new HttpException('USER_NOT_FOUND', 404);

    user.isDeleted = true;

    await this.usersRepository.save(user);
  }
}
