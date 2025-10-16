import { MigrationInterface, QueryRunner } from "typeorm";

export class User1760610458145 implements MigrationInterface {
    name = 'User1760610458145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CUSTOMER', 'ADMIN', 'OPERATOR', 'SUPPORT')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "phone" character varying, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "material" character varying, "color" character varying, "quantity" integer NOT NULL DEFAULT '1', "price" integer NOT NULL DEFAULT '0', "orderId" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_files" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "size" character varying, "orderId" integer, CONSTRAINT "PK_6cc0a459c368847e7e6e0dc0b94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_timeline" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE, "status" character varying NOT NULL, "note" character varying, "orderId" integer, CONSTRAINT "PK_e6c8ff4a57760022bbf838d2a73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('paid', 'in_review', 'slicing', 'printing', 'postproc', 'qa', 'packing', 'shipped', 'delivered', 'cancelled', 'finished')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "externalId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."orders_status_enum" NOT NULL DEFAULT 'in_review', "total" integer NOT NULL DEFAULT '0', "currency" character varying NOT NULL DEFAULT 'INR', "estimatedDelivery" date, "shippingMethod" character varying, "trackingNumber" character varying, "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_8a5f86e37bd3e50490a07ee09ca" UNIQUE ("externalId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_files" ADD CONSTRAINT "FK_f31406566e4ff93210d449bfbf1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_timeline" ADD CONSTRAINT "FK_93d97b3f29475b1db090a8451db" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_timeline" DROP CONSTRAINT "FK_93d97b3f29475b1db090a8451db"`);
        await queryRunner.query(`ALTER TABLE "order_files" DROP CONSTRAINT "FK_f31406566e4ff93210d449bfbf1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_timeline"`);
        await queryRunner.query(`DROP TABLE "order_files"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
