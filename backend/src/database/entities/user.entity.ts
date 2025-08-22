import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserPreference } from './user-preference.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  firstName?: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  lastName?: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  avatar?: string;

  @Column({ default: false, type: 'boolean' })
  isAdmin: boolean;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => UserPreference, (preference) => preference.user)
  preferences: UserPreference[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
