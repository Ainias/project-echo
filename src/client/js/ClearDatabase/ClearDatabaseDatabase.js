import {EasySyncClientDb} from "cordova-sites-easy-sync/dist/client/EasySyncClientDb";
import {ClearDatabaseMigration1000000000000} from "./ClearDatabaseMigration";

export class ClearDatabaseDatabase extends EasySyncClientDb{

    _createConnectionOptions(database) {
        let options = super._createConnectionOptions(database);
        Object.assign(options, {
            synchronize: false,
            migrationsRun: true,
            migrations: [ClearDatabaseMigration1000000000000],
            entities: [],
            migrationsTableName: "Clear_Database_Migrations"
        });
        console.log(options);
        return options;
    }
}