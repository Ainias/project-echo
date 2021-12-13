import * as cron from 'node-cron';

export abstract class AbstractCron {
    private task;
    private isScheduled: boolean = false;

    abstract async run();

    private createTask() {
        if (cron.validate(this.getTime())) {
            this.task = cron.schedule(this.getTime(), () => this.run(), {
                scheduled: this.isScheduled,
            });
        } else {
            throw new Error(this.getTime() + ' is not a valid cron-time!');
        }
    }

    getTime() {
        return '* * 2 * * *';
    }

    getTask() {
        if (!this.task) {
            this.createTask();
        }
        return this.task;
    }

    start() {
        this.getTask().start();
    }

    stop() {
        this.getTask().stop();
    }

    destroy() {
        this.getTask().destroy();
    }
}
