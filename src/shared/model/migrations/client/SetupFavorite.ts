import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/cordova-sites-database';

export class SetupFavorite1000000000001 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        await this._addFavorite(queryRunner);
    }

    async _addFavorite(queryRunner: QueryRunner) {
        let churchTable = new Table({
            name: 'favorite',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: 'integer',
                    isGenerated: true,
                    generationStrategy: 'increment' as 'increment',
                },
                {
                    name: 'eventId',
                    type: BaseDatabase.TYPES.INTEGER,
                },
            ],
            indices: [
                {
                    name: 'IDX_favorite_eventId',
                    columnNames: ['eventId'],
                },
            ],
            foreignKeys: [
                {
                    name: 'FK_favorite_eventId',
                    columnNames: ['eventId'],
                    referencedTableName: 'event',
                    referencedColumnNames: ['id'],
                },
            ],
        });
        return await queryRunner.createTable(churchTable, true);
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}
