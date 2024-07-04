import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Column()
  firstName: string;

  @Column()
  lastName: string | null;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isDeleted: boolean;

  access_token: string;

  refresh_token: string;

  expiresIn: string;

  constructor(users: Partial<Users>) {
    Object.assign(this, users);
  }
}
