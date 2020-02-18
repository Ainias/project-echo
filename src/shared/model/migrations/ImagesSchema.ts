import {MigrationInterface, QueryRunner} from "typeorm";
import {MigrationHelper} from "js-helper/dist/shared/MigrationHelper";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";
import {Fsj} from "../Fsj";
import {Church} from "../Church";
import {Event} from "../Event";

export class ImagesSchema1000000010000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        let fsjImages = await queryRunner.query("SELECT id, images FROM fsj;");
        let churchImages = await queryRunner.query("SELECT id, images FROM church;");
        let eventImages = await queryRunner.query("SELECT id, images FROM event;");

        await MigrationHelper.addTableFromModelClass(FileMedium, queryRunner);

        if (MigrationHelper.isServer()) {
            await queryRunner.query("SET foreign_key_checks=0;");
            await MigrationHelper.updateModel(queryRunner, Fsj);
            await MigrationHelper.updateModel(queryRunner, Church);
            await MigrationHelper.updateModel(queryRunner, Event);
            await queryRunner.query("SET foreign_key_checks=1;");
        } else {
            await queryRunner.query("PRAGMA foreign_keys = OFF");
            await MigrationHelper.updateModel(queryRunner, Fsj);
            await MigrationHelper.updateModel(queryRunner, Church);
            await MigrationHelper.updateModel(queryRunner, Event);
            await queryRunner.query("PRAGMA foreign_keys = ON");
        }

        let fsjManyToManyTable = MigrationHelper.createManyToManyTable("fsj", "fileMedium");
        fsjManyToManyTable.name = "fsjImages";
        let churchManyToManyTable = MigrationHelper.createManyToManyTable("church", "fileMedium");
        churchManyToManyTable.name = "churchImages";
        let eventManyToManyTable = MigrationHelper.createManyToManyTable("event", "fileMedium");
        eventManyToManyTable.name = "eventImages";

        await queryRunner.createTable(fsjManyToManyTable);
        await queryRunner.createTable(churchManyToManyTable);
        await queryRunner.createTable(eventManyToManyTable);

        let fsjImageIds = [];
        let insertIntoFileMedium = [];
        let id = 0;
        fsjImages.forEach(images => {
            JSON.parse(images["images"]).forEach(image => {
                id++;
                insertIntoFileMedium.push("(" + [id, "now()", "now()", "1", "0", "\"" + image + "\""].join(",") + ")");
                fsjImageIds.push("(" + [images["id"], id].join(",") + ")");
            });
        });

        let churchImageIds = [];
        churchImages.forEach(images => {
            JSON.parse(images["images"]).forEach(image => {
                id++;
                insertIntoFileMedium.push("(" + [id, "now()", "now()", "1", "0", "\"" + image + "\""].join(",") + ")");
                churchImageIds.push("(" + [images["id"], id].join(",") + ")");
            });
        });

        let eventImageIds = [];
        eventImages.forEach(images => {
            if (images["images"] && images["images"].trim() !== "") {
                JSON.parse(images["images"]).forEach(image => {
                    id++;
                    insertIntoFileMedium.push("(" + [id, "now()", "now()", "1", "0", "\"" + image + "\""].join(",") + ")");
                    eventImageIds.push("(" + [images["id"], id].join(",") + ")");
                });
            }
        });

        if (churchImageIds.length + fsjImageIds.length + eventImageIds.length> 0) {
            await queryRunner.query("INSERT INTO file_medium (id, createdAt, updatedAt, version, deleted, src) VALUES " + insertIntoFileMedium.join(",") + ";");
            if (fsjImageIds.length > 0) {
                await queryRunner.query("INSERT INTO fsjImages (fsjId, fileMediumId) VALUES " + fsjImageIds.join(",") + ";");
            }
            if (churchImageIds.length > 0) {
                await queryRunner.query("INSERT INTO churchImages (churchId, fileMediumId) VALUES " + churchImageIds.join(",") + ";");
            }
            if (eventImageIds.length > 0) {
                await queryRunner.query("INSERT INTO eventImages (eventId, fileMediumId) VALUES " + eventImageIds.join(",") + ";");
            }
        }
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}