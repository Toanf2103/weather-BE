import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722703150260 implements MigrationInterface {
    name = 'Migration1722703150260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` CHANGE \`id\` \`id\` int UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` ADD PRIMARY KEY (\`email\`, \`city\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` ADD \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`weather_notifications\` CHANGE \`id\` \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
    }

}
