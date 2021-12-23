import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/cordova-sites-database';
import { MigrationHelper } from 'js-helper/dist/shared';

export class SetupSchema1000000000000 implements MigrationInterface {
    private isServer(): boolean {
        return typeof document !== 'object';
    }

    private createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await this.addChurch(queryRunner);
        await this.addEvent(queryRunner);
        await this.addRegion(queryRunner);
        await this.addPost(queryRunner);
        await this.addChurchEvent(queryRunner);
        await this.addChurchRegion(queryRunner);
        await this.addEventRegion(queryRunner);
        await this.addPostRegion(queryRunner);

        // For new setup remove clear-table Possible endless-loop if error in clean setup
        await queryRunner.dropTable('Clear_Database_Migrations', true);
    }

    private async addChurch(queryRunner: QueryRunner) {
        const churchTable = new Table({
            name: 'church',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this.isServer(),
                    generationStrategy: 'increment' as const,
                },
                {
                    name: 'createdAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'updatedAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'version',
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: 'deleted',
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: 'names',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'descriptions',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'places',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'images',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'website',
                    type: BaseDatabase.TYPES.STRING,
                },
            ],
        });
        return queryRunner.createTable(churchTable, true);
    }

    private async addEvent(queryRunner: QueryRunner) {
        const regionTable = new Table({
            name: 'event',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this.isServer(),
                    generationStrategy: 'increment' as const,
                },
                {
                    name: 'createdAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'updatedAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'version',
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: 'deleted',
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: 'names',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'descriptions',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'places',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'images',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'startTime',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'endTime',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'type',
                    type: BaseDatabase.TYPES.STRING,
                },
            ],
        });
        return queryRunner.createTable(regionTable, true);
    }

    private async addRegion(queryRunner: QueryRunner) {
        const eventTable = new Table({
            name: 'region',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this.isServer(),
                    generationStrategy: 'increment' as const,
                },
                {
                    name: 'createdAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'updatedAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'version',
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: 'deleted',
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: 'name',
                    type: BaseDatabase.TYPES.STRING,
                },
            ],
        });
        return queryRunner.createTable(eventTable, true);
    }

    private async addPost(queryRunner: QueryRunner) {
        const regionTable = new Table({
            name: 'post',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this.isServer(),
                    generationStrategy: 'increment' as const,
                },
                {
                    name: 'createdAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'updatedAt',
                    type: BaseDatabase.TYPES.DATE,
                },
                {
                    name: 'version',
                    type: BaseDatabase.TYPES.INTEGER,
                },
                {
                    name: 'deleted',
                    type: BaseDatabase.TYPES.BOOLEAN,
                },
                {
                    name: 'texts',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'priority',
                    type: BaseDatabase.TYPES.INTEGER,
                },
            ],
        });
        return queryRunner.createTable(regionTable, true);
    }

    private async addChurchEvent(queryRunner: QueryRunner) {
        return queryRunner.createTable(this.createManyToManyTable('church', 'event'), true);
    }

    private async addChurchRegion(queryRunner: QueryRunner) {
        return queryRunner.createTable(this.createManyToManyTable('church', 'region'), true);
    }

    private async addEventRegion(queryRunner: QueryRunner) {
        return queryRunner.createTable(this.createManyToManyTable('event', 'region'), true);
    }

    private async addPostRegion(queryRunner: QueryRunner) {
        return queryRunner.createTable(this.createManyToManyTable('post', 'region'), true);
    }

    down(): Promise<any> {
        return undefined;
    }
}
