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

export class Sync {

    static async sync(awaitFullSync){
        let syncJob = new SyncJob();

        // const threeMonthsAgo = new Date();
        // threeMonthsAgo.setUTCDate(1);
        // threeMonthsAgo.setUTCMonth(threeMonthsAgo.getUTCMonth()-3);
        // threeMonthsAgo.setUTCHours(0);
        // threeMonthsAgo.setUTCMinutes(0);
        // threeMonthsAgo.setUTCSeconds(0);
        // threeMonthsAgo.setUTCMilliseconds(0);
        //
        // console.log(threeMonthsAgo);

        await syncJob.syncInBackgroundIfDataExists([Church, Event, Region, Post, Fsj, RepeatedEvent, BlockedDay, FileMedium]).catch(e => console.error(e));
        let p = syncJob.getSyncPromise().then(async res => {
            await EventHelper.updateFavorites(res["BlockedDay"]);
            await EventHelper.updateNotificationsForEvents(res["Event"]["changed"]);
            await EventHelper.deleteNotificationsForEvents(res["Event"]["deleted"]);
        }).catch(e => console.error(e));
        if (Helper.nonNull(awaitFullSync, true)){
            await p
        }
    }

    static test() {
        BackgroundFetch.configure(async (taskId) => {
            let syncPromise = this.sync();

            //Prevent timeout on iOS
            let timeoutPromise = new Promise(r => setTimeout(r, 29*1000));
            await Promise.race([syncPromise, timeoutPromise]);

            BackgroundFetch.finish(taskId);
        }, async (error) => {
            console.log("[background-sync]", error)
            let errorObj = await NativeStoragePromise.getItem("background-error-obj", []);
            errorObj.push(error);
            await NativeStoragePromise.setItem("background-error-obj", errorObj);
        }, {
            minimumFetchInterval: 30,
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
        });
    }
}

App.addInitialization(() => {
    Sync.test();
});
