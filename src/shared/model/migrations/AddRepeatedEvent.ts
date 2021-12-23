import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationHelper } from 'js-helper/dist/shared/MigrationHelper';
import { RepeatedEvent } from '../RepeatedEvent';
import { Event } from './models/v1/Event';
import { BlockedDay } from '../BlockedDay';

export class AddRepeatedEvent1000000007000 implements MigrationInterface {
    private isServer(): boolean {
        return typeof document !== 'object';
    }

    private createManyToManyTable(tableOne, tableTwo) {
        return MigrationHelper.createManyToManyTable(tableOne, tableTwo);
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        if (this.isServer()) {
            await queryRunner.query('ALTER TABLE event ENGINE=InnoDB;');
        }

        const repeatedEventTable = MigrationHelper.createTableFromModelClass(RepeatedEvent);
        await queryRunner.createTable(repeatedEventTable);

        const blockedDayTable = MigrationHelper.createTableFromModelClass(BlockedDay);
        await queryRunner.createTable(blockedDayTable);

        if (this.isServer()) {
            await queryRunner.query('SET foreign_key_checks=0;');
            await MigrationHelper.updateModel(queryRunner, Event);
            await queryRunner.query('SET foreign_key_checks=1;');
        } else {
            await queryRunner.query('PRAGMA foreign_keys = OFF');
            await MigrationHelper.updateModel(queryRunner, Event);
            await queryRunner.query('PRAGMA foreign_keys = ON');
        }
    }

    down(): Promise<any> {
        return undefined;
    }
}
