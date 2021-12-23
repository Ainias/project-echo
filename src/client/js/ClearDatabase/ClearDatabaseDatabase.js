import { EasySyncClientDb } from 'cordova-sites-easy-sync/dist/client/EasySyncClientDb';
import { ClearDatabaseMigration1000000000000 } from './ClearDatabaseMigration';

export class ClearDatabaseDatabase extends EasySyncClientDb {
    createConnectionOptions(database) {
        const options = super.createConnectionOptions(database);
        Object.assign(options, {
            synchronize: false,
            migrationsRun: true,
            migrations: [ClearDatabaseMigration1000000000000],
            entities: [],
            migrationsTransactionMode: 'none',
            migrationsTableName: 'Clear_Database_Migrations',
        });
        console.log(options);
        return options;
    }
}
