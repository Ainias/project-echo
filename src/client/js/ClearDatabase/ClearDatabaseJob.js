import { ClearDatabaseDatabase } from './ClearDatabaseDatabase';

export class ClearDatabaseJob {
    static async doJob() {
        return new ClearDatabaseDatabase()._connectionPromise;
    }
}
