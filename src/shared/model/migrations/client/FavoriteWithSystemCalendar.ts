import { MigrationInterface, QueryRunner } from 'typeorm';

export class FavoriteWithSystemCalendar1000000000002 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        await this._changeFavorite(queryRunner);
    }

    async _changeFavorite(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE favorite ADD isFavorite boolean NOT NULL DEFAULT true');
        await queryRunner.query('ALTER TABLE favorite ADD systemCalendarId INTEGER');
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}
