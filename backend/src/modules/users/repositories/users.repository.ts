import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

//TODO: hacer gestion de errores en el back

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(private dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }

  async findById(id: string): Promise<Users | undefined> {
    return this.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.findOne({ where: { email } });
  }
}
