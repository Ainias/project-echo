import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationHelper } from 'js-helper/dist/shared/MigrationHelper';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared';

export class ImagesSchemaDownload1000000011000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<any> {
        if (MigrationHelper.isServer()) {
            await queryRunner.query('SET foreign_key_checks=0;');
            await MigrationHelper.updateModel(queryRunner, FileMedium);
            await queryRunner.query('SET foreign_key_checks=1;');
        } else {
            if (queryRunner.connection.options.type !== 'cordova') {
                // Why ever stop und start von Transaction, damit foreign keys funktionieren
                await queryRunner.commitTransaction();
                await queryRunner.startTransaction();
            }

            await queryRunner.query('PRAGMA foreign_keys = OFF');
            await MigrationHelper.updateModel(queryRunner, FileMedium);
            await queryRunner.query('PRAGMA foreign_keys = ON');
        }
    }

    down(): Promise<any> {
        return undefined;
    }
}
