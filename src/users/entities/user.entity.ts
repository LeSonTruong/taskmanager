import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // Thêm !

  @Column()
  name!: string; // Thêm !

  @Column({ unique: true })
  email!: string; // Thêm !

  @Column()
  @Exclude()
  password!: string; // Thêm !

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole; // Thêm !

  @Column({ default: false })
  isVerified!: boolean; // Thêm !

  @Column({ type: 'text', nullable: true })
  @Exclude()
  emailToken!: string | null; // Thêm ! (và giữ | null)
}
