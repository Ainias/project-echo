import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {BaseDatabase} from "cordova-sites-database/dist/cordova-sites-database";

export class FavoriteWithoutEventRelation1000000008000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        await this._changeFavorite(queryRunner);
    }

    async _changeFavorite(queryRunner: QueryRunner) {

        await queryRunner.dropTable("favorite");

        let favoriteTable = new Table({
            name: "favorite",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: "integer",
                    isGenerated: true,
                    generationStrategy: "increment" as "increment"
                },
                {
                    name: "eventId",
                    type: BaseDatabase.TYPES.STRING
                },
                {
                    name: "isFavorite",
                    type: BaseDatabase.TYPES.BOOLEAN,
                    default: 1,
                    isNullable: false,
                },
                {
                    name: "systemCalendarId",
                    type: BaseDatabase.TYPES.INTEGER,
                    isNullable: true
                }
            ],
        });
        return await queryRunner.createTable(favoriteTable, true)
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }

}
