import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/BaseDatabase';

export class ChurchInstalink1000000013000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        await this.addWeblink(queryRunner);
    }

    private async addWeblink(queryRunner: QueryRunner) {
        await queryRunner.addColumn(
            'church',
            new TableColumn({
                name: 'instagram',
                type: BaseDatabase.TYPES.STRING,
                isNullable: true,
            })
        );
    }

    down(): Promise<any> {
        return undefined;
    }
}
