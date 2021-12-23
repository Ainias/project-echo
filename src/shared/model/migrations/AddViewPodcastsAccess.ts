import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddViewPodcastsAccess1000000015000 implements MigrationInterface {
    down(): Promise<any> {
        return Promise.resolve(undefined);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "INSERT INTO access (createdAt, updatedAt, version, deleted, name, description) VALUES (now(), now(), 1, 0, 'view_podcasts', 'needed to show the podcast-tab')"
        );
        const accessId = await queryRunner.query("SELECT id FROM access WHERE name = 'view_podcasts'");

        await queryRunner.query(
            "INSERT INTO role (createdAt, updatedAt, version, deleted, name, description) VALUES (now(), now(), 1,0, 'podcast-viewer', 'can view podcasts')"
        );
        const roleId = await queryRunner.query("SELECT id FROM role WHERE name = 'podcast-viewer'");

        await queryRunner.query(
            `INSERT INTO roleAccess (roleId, accessId) VALUES (${roleId[0].id}, ${accessId[0].id})`
        );
    }
}
