import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<Users>> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Users> {
    return this.usersService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<Users | undefined> {
    return this.usersService.getUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
