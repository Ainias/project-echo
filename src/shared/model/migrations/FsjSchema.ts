import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/cordova-sites-database';
import { MigrationHelper } from 'js-helper/dist/shared/MigrationHelper';

export class FsjSchema1000000006000 implements MigrationInterface {
    _isServer(): boolean {
        return typeof document !== 'object';
    }

    _createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await this._addFsj(queryRunner);
    }

    async _addFsj(queryRunner: QueryRunner) {
        let fsjTable = new Table({
            name: 'fsj',
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
                    name: 'images',
                    type: this._isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'website',
                    type: BaseDatabase.TYPES.STRING,
                },
            ],
        });
        return await queryRunner.createTable(fsjTable, true);
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}
