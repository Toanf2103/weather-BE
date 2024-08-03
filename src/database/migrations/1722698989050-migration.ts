import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722698989050 implements MigrationInterface {
    name = 'Migration1722698989050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`weather_notifications\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`city\` varchar(100) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`weather_notifications\``);
    }

}
