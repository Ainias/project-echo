import { AbstractCron } from './AbstractCron';
import { DeleteOldEventsJob } from '../../shared/DeleteOldEventsJob';

export class DeleteOldEventsCron extends AbstractCron {
    async run(): Promise<any> {
        const numDeleted = await DeleteOldEventsJob.deleteOldEvents();
        if (numDeleted >= 1) {
            console.log('Deleted ' + numDeleted + ' Events!');
        }
    }

    getTime(): string {
        return '0 0 2 1 * *';
    }
}
