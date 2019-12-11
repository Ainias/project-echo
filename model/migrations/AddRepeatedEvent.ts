import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {MigrationHelper} from "js-helper/src/shared/MigrationHelper";
import {RepeatedEvent} from "../RepeatedEvent";

export class AddRepeatedEvent1000000007000 implements MigrationInterface {

    _isServer(): boolean {
        return (typeof document !== "object")
    }

    _createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        let table = MigrationHelper.createTableFromModelClass(RepeatedEvent);
        await queryRunner.createTable(table);

        await queryRunner.query("ALTER TABLE event ADD repeatedEventId INTEGER NULL;");
        await queryRunner.query("CREATE INDEX IDX_event_repeated_eventId ON event(repeatedEventId);");
        await queryRunner.query("ALTER TABLE event ADD CONSTRAINT FK_event_repeated_eventId FOREIGN KEY (repeatedEventId) REFERENCES repeated_event.id;");
    }


    down(queryRunner: QueryRunner): Promise<any> {
        return undefined;
    }

}