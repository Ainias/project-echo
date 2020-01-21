import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {MigrationHelper} from "js-helper/src/shared/MigrationHelper";
import {RepeatedEvent} from "../RepeatedEvent";
import {Event} from "./models/v1/Event";
import {BlockedDay} from "../BlockedDay";

export class AddRepeatedEvent1000000007000 implements MigrationInterface {

    _isServer(): boolean {
        return (typeof document !== "object")
    }

    _createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        if (this._isServer()){
            await queryRunner.query("ALTER TABLE event ENGINE=InnoDB;");
        }

        let repeatedEventTable = MigrationHelper.createTableFromModelClass(RepeatedEvent);
        await queryRunner.createTable(repeatedEventTable);

        let blockedDayTable = MigrationHelper.createTableFromModelClass(BlockedDay);
        await queryRunner.createTable(blockedDayTable);

        if (this._isServer()) {
            await queryRunner.query("SET foreign_key_checks=0;");
            await MigrationHelper.updateModel(queryRunner, Event);
            await queryRunner.query("SET foreign_key_checks=1;");
        } else {
            await queryRunner.query("PRAGMA foreign_keys = OFF");
            await MigrationHelper.updateModel(queryRunner, Event);
            await queryRunner.query("PRAGMA foreign_keys = ON");
        }
    }

    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }
}