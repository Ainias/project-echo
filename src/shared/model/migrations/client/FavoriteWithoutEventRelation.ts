import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/cordova-sites-database';

export class FavoriteWithoutEventRelation1000000008000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        await this.changeFavorite(queryRunner);
    }

    async changeFavorite(queryRunner: QueryRunner) {
        await queryRunner.dropTable('favorite');

        const favoriteTable = new Table({
            name: 'favorite',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: 'integer',
                    isGenerated: true,
                    generationStrategy: 'increment' as const,
                },
                {
                    name: 'eventId',
                    type: BaseDatabase.TYPES.STRING,
                },
                {
                    name: 'isFavorite',
                    type: BaseDatabase.TYPES.BOOLEAN,
                    default: 1,
                    isNullable: false,
                },
                {
                    name: 'systemCalendarId',
                    type: BaseDatabase.TYPES.INTEGER,
                    isNullable: true,
                },
            ],
        });
        return queryRunner.createTable(favoriteTable, true);
    }

    down(): Promise<any> {
        return undefined;
    }
}
