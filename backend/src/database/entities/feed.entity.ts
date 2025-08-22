import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('feeds')
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastFetched?: Date;

  @Column({ default: 0 })
  fetchCount: number;

  @Column({ default: 0 })
  errorCount: number;

  @Column({ nullable: true })
  lastError?: string;

  @Column({ default: 30 })
  fetchIntervalMinutes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;
}
