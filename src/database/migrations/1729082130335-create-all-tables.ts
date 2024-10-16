import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateAllTables1729082130335 implements MigrationInterface {
  name = 'CreateAllTables1729082130335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."communications_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "communications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "follower_id" uuid NOT NULL, "following_id" uuid NOT NULL, 
      "status" "public"."communications_status_enum" NOT NULL DEFAULT 'PENDING', CONSTRAINT "PK_29ec793018d5d5ca19d40149e87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('USER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('VERIFIED', 'UNVERIFIED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, 
      "last_name" character varying NOT NULL, "age" character varying, 
      "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying NOT NULL, 
      "password" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'UNVERIFIED', 
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_41dd0e540c8cd037d20b553b896" 
      FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_a8423a12514e4578dbe48a9799e" FOREIGN KEY 
      ("following_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_a8423a12514e4578dbe48a9799e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_41dd0e540c8cd037d20b553b896"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "communications"`);
    await queryRunner.query(`DROP TYPE "public"."communications_status_enum"`);
  }
}
