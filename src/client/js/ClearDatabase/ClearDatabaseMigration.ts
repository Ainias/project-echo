import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {BaseDatabase} from "cordova-sites-database/dist/cordova-sites-database";

export class ClearDatabaseMigration1000000000000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        //clearDatabase uses own transaction => commit before and start after
        await queryRunner.commitTransaction();
        await queryRunner.clearDatabase();
        await queryRunner.startTransaction();

        //migration table must be present
        await queryRunner.createTable(new Table({
            name: "Clear_Database_Migrations",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: "integer",
                    isGenerated: true,
                    generationStrategy: "increment" as "increment"
                },
                {
                    name: "timestamp",
                    type: BaseDatabase.TYPES.INTEGER
                },
                {
                    name: "name",
                    type: BaseDatabase.TYPES.STRING
                }
            ],
        }))
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }

}