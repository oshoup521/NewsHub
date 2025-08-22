import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity('user_preferences')
@Unique(['userId', 'categoryId'])
@Index(['userId'])
export class UserPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  categoryId: number;

  @Column({ default: 1 })
  priority: number;

  @Column({ default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
