import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user, { onDelete: 'SET NULL' })
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`User #${this.id} is inserted.`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User #${this.id} is updated.`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User #${this.id} is removed.`);
  }
}
