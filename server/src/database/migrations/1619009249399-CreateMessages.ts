import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMessages1619009249399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "messages",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "admin_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "user_id",
            type: "uuid",
          },
          {
            name: "text",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FKUser",
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            columnNames: ["user_id"],
            //no caso do nosso projeto definimos que caso um usuário seja excluído do sistema, as mensagens dele continuarão existindo mas o campo 'user_id' será definido como null, existiria outras formas de ações ao excluir, como por exemplo o 'CASCADE' que caso fosse excluído ele apagaria todas as mensagens que tivessem o id desse usuário ou o 'RESTRICT' que não permitia que o usuário fosse removido por estar atrelado a essa tabela
            onDelete: "SET NULL",
            onUpdate: "SET NULL",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("messages");
  }
}
