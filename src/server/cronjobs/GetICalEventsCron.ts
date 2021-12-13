import { AbstractCron } from './AbstractCron';
import * as ical from 'node-ical';

export class GetICalEventsCron extends AbstractCron {
    async run(): Promise<any> {
        const events = await ical.async.fromURL(
            'https://calendar.google.com/calendar/ical/113ub2m3kcama13e9sov8c9m3o%40group.calendar.google.com/public/basic.ics'
        );
        console.log('events', Object.keys(events).length);
    }

    getTime(): string {
        return '*/5 1 1 1 * *';
    }
}
