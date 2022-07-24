import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
