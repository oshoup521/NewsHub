import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Feed } from './feed.entity';
import { Category } from './category.entity';

@Entity('articles')
@Index(['url'], { unique: true })
@Index(['publishedAt'])
@Index(['title'])
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  content?: string;

  @Column({ unique: true })
  @Index()
  url: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  publishedAt?: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  bookmarkCount: number;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Feed, { eager: true })
  @JoinColumn({ name: 'feedId' })
  feed: Feed;

  @Column()
  feedId: number;

  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;
}
