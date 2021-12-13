import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/cordova-sites-database';
import { MigrationHelper } from 'js-helper/dist/shared';

export class SetupSchema1000000000000 implements MigrationInterface {
    _isServer(): boolean {
        return typeof document !== 'object';
    }

    _createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await this._addChurch(queryRunner);
        await this._addEvent(queryRunner);
        await this._addRegion(queryRunner);
        await this._addPost(queryRunner);
        await this._addChurchEvent(queryRunner);
        await this._addChurchRegion(queryRunner);
        await this._addEventRegion(queryRunner);
        await this._addPostRegion(queryRunner);

        //For new setup remove clear-table Possible endless-loop if error in clean setup
        await queryRunner.dropTable('Clear_Database_Migrations', true);
    }

    async _addChurch(queryRunner: QueryRunner) {
        let churchTable = new Table({
            name: 'church',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: 'increment' as 'increment',
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
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'descriptions',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'places',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'images',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'website',
                    type: BaseDatabase.TYPES.STRING,
                },
            ],
        });
        return await queryRunner.createTable(churchTable, true);
    }

    async _addEvent(queryRunner: QueryRunner) {
        let regionTable = new Table({
            name: 'event',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: 'increment' as 'increment',
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
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'descriptions',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'places',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'images',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
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
        return await queryRunner.createTable(regionTable, true);
    }

    async _addRegion(queryRunner: QueryRunner) {
        let eventTable = new Table({
            name: 'region',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: 'increment' as 'increment',
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
        return await queryRunner.createTable(eventTable, true);
    }

    async _addPost(queryRunner: QueryRunner) {
        let regionTable = new Table({
            name: 'post',
            columns: [
                {
                    name: 'id',
                    isPrimary: true,
                    type: BaseDatabase.TYPES.INTEGER,
                    isGenerated: this._isServer(),
                    generationStrategy: 'increment' as 'increment',
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
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'priority',
                    type: BaseDatabase.TYPES.INTEGER,
                },
            ],
        });
        return await queryRunner.createTable(regionTable, true);
    }

    async _addChurchEvent(queryRunner: QueryRunner) {
        return await queryRunner.createTable(this._createManyToManyTable('church', 'event'), true);
    }

    async _addChurchRegion(queryRunner: QueryRunner) {
        return await queryRunner.createTable(this._createManyToManyTable('church', 'region'), true);
    }

    async _addEventRegion(queryRunner: QueryRunner) {
        return await queryRunner.createTable(this._createManyToManyTable('event', 'region'), true);
    }

    async _addPostRegion(queryRunner: QueryRunner) {
        return await queryRunner.createTable(this._createManyToManyTable('post', 'region'), true);
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}
