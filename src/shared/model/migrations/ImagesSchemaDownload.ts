import {MigrationInterface, QueryRunner} from "typeorm";
import {MigrationHelper} from "js-helper/dist/shared/MigrationHelper";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";

export class ImagesSchemaDownload1000000011000 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<any> {
        if (MigrationHelper.isServer()) {
            await queryRunner.query("SET foreign_key_checks=0;");
            await MigrationHelper.updateModel(queryRunner, FileMedium);
            await queryRunner.query("SET foreign_key_checks=1;");
        } else {
            console.log("ImagesSchemaDownload 1")
            await queryRunner.query("PRAGMA foreign_keys=OFF;");
            console.log(await queryRunner.query("PRAGMA foreign_keys"));
            await MigrationHelper.updateModel(queryRunner, FileMedium);
            await queryRunner.query("PRAGMA foreign_keys = ON");
            console.log("ImagesSchemaDownload 2")
        }
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}
