import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationHelper } from 'js-helper/dist/shared/MigrationHelper';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared';
import { Fsj } from './models/v2/Fsj';
import { Church } from './models/v2/Church';
import { Event } from './models/v2/Event';

export class ImagesSchema1000000010000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        if (MigrationHelper.isServer()) {
            await queryRunner.query('ALTER TABLE church ENGINE=InnoDB;');
            await queryRunner.query('ALTER TABLE fsj ENGINE=InnoDB;');
        }

        if (!(await queryRunner.hasTable('file_medium'))) {
            const table = MigrationHelper.createTableFromModelClass(FileMedium);
            table.columns.forEach((column) => {
                if (column.name === 'src') {
                    column.type = MigrationHelper.isServer() ? 'MEDIUMTEXT' : 'TEXT';
                }
            });
            await queryRunner.createTable(table);
        }

        const fsjManyToManyTable = MigrationHelper.createManyToManyTable('fsj', 'fileMedium');
        fsjManyToManyTable.name = 'fsjImages';
        const churchManyToManyTable = MigrationHelper.createManyToManyTable('church', 'fileMedium');
        churchManyToManyTable.name = 'churchImages';
        const eventManyToManyTable = MigrationHelper.createManyToManyTable('event', 'fileMedium');
        eventManyToManyTable.name = 'eventImages';

        await queryRunner.createTable(churchManyToManyTable);
        await queryRunner.createTable(fsjManyToManyTable);
        await queryRunner.createTable(eventManyToManyTable);

        if (MigrationHelper.isServer()) {
            await queryRunner.query('SET foreign_key_checks=0;');
            await queryRunner.query(
                'INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) SELECT id, now(), now(), 1, 0, SUBSTRING(images, 3, LENGTH(images)-4) FROM fsj'
            );
            await queryRunner.query('INSERT INTO fsjImages (fsjId, fileMediumId) SELECT id, id FROM fsj');

            let idOffset = (await queryRunner.query('SELECT MAX(id) AS maxId FROM file_medium'))[0].maxId;
            idOffset++;

            await queryRunner.query(
                `INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) SELECT id+${idOffset}, now(), now(), 1, 0, SUBSTRING(images, 3, LENGTH(images)-4) FROM church`
            );
            await queryRunner.query(
                `INSERT INTO churchImages (churchId, fileMediumId) SELECT id, id+${idOffset} FROM church`
            );

            idOffset = (await queryRunner.query('SELECT MAX(id) AS maxId FROM file_medium'))[0].maxId;
            idOffset++;

            await queryRunner.query(
                `INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) SELECT id+${idOffset}, now(), now(), 1, 0, SUBSTRING(images, 3, LENGTH(images)-4) FROM event WHERE event.images IS NOT NULL`
            );
            await queryRunner.query(
                `INSERT INTO eventImages (eventId, fileMediumId) SELECT id, id+${idOffset} FROM event`
            );

            await queryRunner.query('UPDATE fsj SET updatedAt = now();');
            await queryRunner.query('UPDATE church SET updatedAt = now();');
            await queryRunner.query('UPDATE event SET updatedAt = now();');
        }

        await MigrationHelper.updateModel(queryRunner, Fsj);
        await MigrationHelper.updateModel(queryRunner, Church);
        await MigrationHelper.updateModel(queryRunner, Event);

        if (MigrationHelper.isServer()) {
            await queryRunner.query('SET foreign_key_checks=1;');
        } else {
            await queryRunner.query('PRAGMA foreign_keys = ON');
        }
    }

    down(): Promise<any> {
        return undefined;
    }
}
