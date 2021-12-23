import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationHelper } from 'js-helper/dist/shared/MigrationHelper';
import { Podcast } from './models/v2/Podcast';
import { Helper } from 'js-helper/dist/shared/Helper';

export class AddPodcasts1000000014000 implements MigrationInterface {
    down(): Promise<any> {
        return Promise.resolve(undefined);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        const podcastTable = MigrationHelper.createTableFromModelClass(Podcast);
        await queryRunner.createTable(podcastTable);

        const podcastImagesTable = MigrationHelper.createManyToManyTable('podcast', 'fileMedium');
        podcastImagesTable.name = 'podcastImages';
        await queryRunner.createTable(podcastImagesTable);

        if (MigrationHelper.isServer()) {
            let accesses = await queryRunner.query('SELECT * FROM access');
            accesses = Helper.arrayToObject(accesses, (obj) => obj.id);

            if (Helper.isNull(accesses['11']))
                await queryRunner.query(
                    "INSERT INTO `access` VALUES (11,'2021-07-02 16:42:42','2021-07-02 16:42:42',2,0,'podcasts','Add/Modify/Delete podcasts');"
                );

            let roleAccesses = await queryRunner.query('SELECT * FROM roleAccess');
            roleAccesses = Helper.arrayToObject(roleAccesses, (obj) => `${obj.roleId},${obj.accessId}`);

            if (Helper.isNull(roleAccesses['6,11']))
                await queryRunner.query('INSERT INTO `roleAccess` (roleId, accessId) VALUES (6,11)');
        }
    }
}
