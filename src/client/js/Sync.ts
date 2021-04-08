import {App} from "cordova-sites";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";

import BackgroundFetch from "cordova-plugin-background-fetch"
import {Church} from "../../shared/model/Church";
import {Event} from "../../shared/model/Event";
import {Region} from "../../shared/model/Region";
import {Post} from "../../shared/model/Post";
import {Fsj} from "../../shared/model/Fsj";
import {RepeatedEvent} from "../../shared/model/RepeatedEvent";
import {BlockedDay} from "../../shared/model/BlockedDay";
import {EventHelper} from "./Helper/EventHelper";
import {SyncJob} from "cordova-sites-easy-sync/dist/client/SyncJob";
import {Helper} from "js-helper/dist/shared/Helper";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared/FileMedium";
import {Singleton} from "cordova-sites/dist/client/js/Singleton";

export class Sync extends Singleton {

    private syncInProgress: Promise<any> = null;

    async sync(awaitFullSync?) {
        if (this.syncInProgress !== null) {
            return this.syncInProgress;
        }
        this.syncInProgress = new Promise<any>(async resolve => {
            let syncJob = new SyncJob();

            await syncJob.syncInBackgroundIfDataExists([Church, Event, Region, Post, Fsj, RepeatedEvent, BlockedDay, FileMedium], false).catch(e => console.error(e));
            let p = syncJob.getSyncPromise().then(async res => {
                await EventHelper.updateFavorites(res["BlockedDay"]);
                await EventHelper.updateNotificationsForEvents(res["Event"]["changed"]);
                await EventHelper.deleteNotificationsForEvents(res["Event"]["deleted"]);
            }).catch(e => console.error(e));
            if (Helper.nonNull(awaitFullSync, true)) {
                await p
            }
            this.syncInProgress = null;
            resolve(undefined);
        });
        return this.syncInProgress;
    }

    static initializeBackgroundFetch() {
        NativeStoragePromise.getItem("num-background-fetches", 0).then(r => console.log("num background fetches since last time: ", r)).then(() => {
            NativeStoragePromise.setItem("num-background-fetches", 0);
        });
        BackgroundFetch.configure(async (taskId) => {
            NativeStoragePromise.setItem("num-background-fetches", await NativeStoragePromise.getItem("num-background-fetches", 0) + 1);

            const sync: Sync = this.getInstance();

            let syncPromise = sync.sync(false);

            //Prevent timeout on iOS
            let timeoutPromise = new Promise(r => setTimeout(r, 29 * 1000));
            await Promise.race([syncPromise, timeoutPromise]);

            BackgroundFetch.finish(taskId);
        }, async (error) => {
            console.log("[background-sync]", error)
            let errorObj = await NativeStoragePromise.getItem("background-error-obj", []);
            errorObj.push(error);
            await NativeStoragePromise.setItem("background-error-obj", errorObj);
        }, {
            minimumFetchInterval: 5,
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
        });
    }
}

App.addInitialization(() => {
    Sync.initializeBackgroundFetch();
});
