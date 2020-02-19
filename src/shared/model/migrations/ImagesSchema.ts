import {MigrationInterface, QueryRunner} from "typeorm";
import {MigrationHelper} from "js-helper/dist/shared/MigrationHelper";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";
import {Fsj} from "../Fsj";
import {Church} from "../Church";
import {Event} from "../Event";

export class ImagesSchema1000000010000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        if (MigrationHelper.isServer()) {
            await queryRunner.query("ALTER TABLE church ENGINE=InnoDB;");
            await queryRunner.query("ALTER TABLE fsj ENGINE=InnoDB;");
        }

        let table = MigrationHelper.createTableFromModelClass(FileMedium);
        table.columns.forEach(column => {
            if (column.name === "src"){
                column.type = MigrationHelper.isServer() ? "MEDIUMTEXT" : "TEXT";
            }
        });
        await queryRunner.createTable(table);

        let fsjManyToManyTable = MigrationHelper.createManyToManyTable("fsj", "fileMedium");
        fsjManyToManyTable.name = "fsjImages";
        let churchManyToManyTable = MigrationHelper.createManyToManyTable("church", "fileMedium");
        churchManyToManyTable.name = "churchImages";
        let eventManyToManyTable = MigrationHelper.createManyToManyTable("event", "fileMedium");
        eventManyToManyTable.name = "eventImages";

        await queryRunner.createTable(churchManyToManyTable);
        await queryRunner.createTable(fsjManyToManyTable);
        await queryRunner.createTable(eventManyToManyTable);

        if (MigrationHelper.isServer()) {
            await queryRunner.query("SET foreign_key_checks=0;");
        } else {
            await queryRunner.query("PRAGMA foreign_keys = OFF");
        }

        await queryRunner.query("INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) SELECT id, now(), now(), 1, 0, SUBSTRING(images, 3, LENGTH(images)-4) FROM fsj");
        await queryRunner.query("INSERT INTO fsjImages (fsjId, fileMediumId) SELECT id, id FROM fsj");

        let idOffset = (await queryRunner.query("SELECT MAX(id) AS maxId FROM file_medium"))[0]["maxId"];
        idOffset++;

        await queryRunner.query("INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) SELECT id+" + idOffset + ", now(), now(), 1, 0, SUBSTRING(images, 3, LENGTH(images)-4) FROM church");
        await queryRunner.query("INSERT INTO churchImages (churchId, fileMediumId) SELECT id, id+" + idOffset + " FROM church");

        idOffset = (await queryRunner.query("SELECT MAX(id) AS maxId FROM file_medium"))[0]["maxId"];
        idOffset++;

        await queryRunner.query("INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) SELECT id+" + idOffset + ", now(), now(), 1, 0, SUBSTRING(images, 3, LENGTH(images)-4) FROM event");
        await queryRunner.query("INSERT INTO eventImages (eventId, fileMediumId) SELECT id, id+" + idOffset + " FROM event");

        await MigrationHelper.updateModel(queryRunner, Fsj);
        await MigrationHelper.updateModel(queryRunner, Church);
        await MigrationHelper.updateModel(queryRunner, Event);

        if (MigrationHelper.isServer()) {
            await queryRunner.query("SET foreign_key_checks=1;");
        } else {
            await queryRunner.query("PRAGMA foreign_keys = ON");
        }
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}