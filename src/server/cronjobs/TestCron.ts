import { AbstractCron } from './AbstractCron';

export class TestCron extends AbstractCron {
    async run(): Promise<any> {
        console.log('Test running!');
    }

    getTime(): string {
        return '1 * * * * *';
    }
}
