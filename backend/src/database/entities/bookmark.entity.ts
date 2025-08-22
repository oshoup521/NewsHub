import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity('bookmarks')
@Unique(['userId', 'articleId'])
@Index(['userId'])
@Index(['createdAt'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  articleId: string;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'articleId' })
  article: Article;
}
