import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/BaseDatabase';

export class EventWeblink1000000012000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        await this.addWeblink(queryRunner);
    }

    private async addWeblink(queryRunner: QueryRunner) {
        await queryRunner.addColumn(
            'event',
            new TableColumn({
                name: 'website',
                type: BaseDatabase.TYPES.STRING,
                isNullable: true,
            })
        );
    }

    down(): Promise<any> {
        return undefined;
    }
}
