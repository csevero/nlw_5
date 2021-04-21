import {
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./Users";

@Entity("messages")
class Message {
  @PrimaryColumn()
  id: string;

  @Column()
  admin_id: string;

  @Column()
  text: string;

  //fazendo o join com a coluna user_id da tabela messages
  @JoinColumn({ name: "user_id" })
  //muitas mensagem para 1 usuário
  @ManyToOne(() => User)
  user: User;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Message };
