import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { BaseDatabase } from 'cordova-sites-database/dist/cordova-sites-database';
import { MigrationHelper } from 'js-helper/dist/shared/MigrationHelper';

export class FsjSchema1000000006000 implements MigrationInterface {
    private isServer(): boolean {
        return typeof document !== 'object';
    }

    private createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        await this.addFsj(queryRunner);
    }

    private async addFsj(queryRunner: QueryRunner) {
        const fsjTable = new Table({
            name: 'fsj',
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
                    name: 'images',
                    type: this.isServer() ? BaseDatabase.TYPES.MEDIUMTEXT : BaseDatabase.TYPES.TEXT,
                },
                {
                    name: 'website',
                    type: BaseDatabase.TYPES.STRING,
                },
            ],
        });
        return queryRunner.createTable(fsjTable, true);
    }

    down(): Promise<any> {
        return undefined;
    }
}
