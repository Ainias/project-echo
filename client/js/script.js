import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction} from "cordova-sites";
import {Helper} from "js-helper/dist/shared"
import {EasySyncClientDb, SetupEasySync1000000000500, SyncJob} from "cordova-sites-easy-sync/client";

import {WelcomeSite} from "./Sites/WelcomeSite";

import {Event} from "../../model/Event";
import {Church} from "../../model/Church";
import {Region} from "../../model/Region";
import "./Model/Favorite"

import {BaseDatabase} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {ListChurchesSite} from "./Sites/ListChurchesSite";
import {AddEventSite} from "./Sites/AddEventSite";
import {UserManager, LoginSite, RegistrationSite, UserMenuAction} from "cordova-sites-user-management/client";
import {CalendarSite} from "./Sites/CalendarSite";
import {ModifyChurchSite} from "./Sites/ModifyChurchSite";
import {ImpressumSite} from "./Sites/ImpressumSite";

import bibelverse from "./bibelverse.json";

//translation import
import "cordova-sites-user-management/src/client/js/translationInit"
import "cordova-sites/dist/client/js/translationInit"
import logo from "../img/logo.png";

import {ModifyPostSite} from "./Sites/ModifyPostSite";
import {Post} from "../../model/Post";
import {SetupSchema1000000000000} from "../../model/migrations/SetupSchema";
import {SetupUserManagement1000000001000} from "cordova-sites-user-management/src/migrations/SetupUserManagement"
import {SetupFavorite1000000000001} from "../../model/migrations/client/SetupFavorite";
import {FsjSchema1000000006000} from "../../model/migrations/FsjSchema";
import {Fsj} from "../../model/Fsj";
import {ModifyFsjSite} from "./Sites/ModifyFsjSite";
import {ListFsjsSite} from "./Sites/ListFsjsSite";
import {SystemCalendar} from "./SystemCalendar";
import {FavoriteWithSystemCalendar1000000000002} from "../../model/migrations/client/FavoriteWithSystemCalendar";
import {SettingsSite} from "./Sites/SettingsSite";
import {RepeatedEvent} from "../../model/RepeatedEvent";
import {AddRepeatedEvent1000000007000} from "../../model/migrations/AddRepeatedEvent";
import {BlockedDay} from "../../model/BlockedDay";
import {EventHelper} from "./Helper/EventHelper";
import {FavoriteWithoutEventRelation1000000008000} from "../../model/migrations/client/FavoriteWithoutEventRelation";
import {ClearDatabaseDatabase} from "./ClearDatabase/ClearDatabaseDatabase";
import {ClearDatabaseJob} from "./ClearDatabase/ClearDatabaseJob";

window["JSObject"] = Object;

// BaseModel._databaseClass = EasySyncClientDb;
EasySyncClientDb.BASE_MODEL = EasySyncBaseModel;

LoginSite.ADD_LOGIN_ACTION = false;
RegistrationSite.ADD_REGISTRATION_ACTION = false;

App.setLogo(logo);

App.addInitialization(async (app) => {

    //add Bibelvers to html
    let vers = bibelverse[Math.floor(Math.random() * (bibelverse.length))];
    document.head.prepend(document.createComment(vers["vers"] + " \n- " + vers["stelle"] + " (" + vers["uebersetzung"] + ")"));

    if (window.StatusBar) {
        StatusBar.overlaysWebView(true);
        StatusBar.backgroundColorByHexString('#33000000');
    }
    Translator.init({
        translations: {
            "de": translationGerman,
            "en": translationEnglish
        },
        fallbackLanguage: "de",
        // markTranslations: true,
        markUntranslatedTranslations: true,
        logMissingTranslations: true,
    });

    //Setting Title
    NavbarFragment.title = "";

    //Creating Menu
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("events", CalendarSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("churches", ListChurchesSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("fsjs", ListFsjsSite));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("about us", WelcomeSite, MenuAction.SHOW_FOR_LARGE));
    NavbarFragment.defaultActions.push(new MenuAction("language", async () => {
        if (Translator.getInstance().getCurrentLanguage() === "en") {
            await Translator.getInstance().setLanguage("de");
        } else {
            await Translator.getInstance().setLanguage("en");
        }
    }, MenuAction.SHOW_FOR_LARGE));

    if (Helper.isMobileApp()) {
        NavbarFragment.defaultActions.push(new StartSiteMenuAction("settings", SettingsSite, MenuAction.SHOW_NEVER, 99000));
    }

    NavbarFragment.defaultActions.push(new StartSiteMenuAction("contact", WelcomeSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("privacy policy", ImpressumSite, MenuAction.SHOW_NEVER));
    NavbarFragment.defaultActions.push(new StartSiteMenuAction("imprint", ImpressumSite, MenuAction.SHOW_NEVER));

    NavbarFragment.defaultActions.push(new UserMenuAction("add event", "admin", () => {
        app.startSite(AddEventSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add church", "admin", () => {
        app.startSite(ModifyChurchSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add fsj", "admin", () => {
        app.startSite(ModifyFsjSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    NavbarFragment.defaultActions.push(new UserMenuAction("add post", "admin", () => {
        app.startSite(ModifyPostSite);
    }, MenuAction.SHOW_FOR_MEDIUM));

    DataManager.setHeader("Accept-Language", "de-DE,dias;q=0.5");
    await UserManager.getInstance().getMe().catch(e => console.error(e));

    // await SystemCalendar.createCalendar("echo");

    //Todo an richtige stelle auslagern
    let syncJob = new SyncJob();
    await syncJob.syncInBackgroundIfDataExists([Church, Event, Region, Post, Fsj, RepeatedEvent, BlockedDay]).catch(e => console.error(e));
    syncJob.getSyncPromise().then(async res => {
        await EventHelper.updateFavorites(res["BlockedDay"]);
        // EventHelper.updateNotificationsForEvents(res["Event"]["changed"]);
        // EventHelper.deleteNotificationsForEvents(res["Event"]["deleted"]);
    });

    // await SystemCalendar.deleteCalendar();
    window["Church"] = Church;

    try {
        //Updates height for "mobile browser address bar hiding"-bug
        let updateWindowHeight = () => {
            document.body.style.height = window.innerHeight + "px";
            setTimeout(updateWindowHeight, 350);
        };
        updateWindowHeight();
    } catch (e) {
    }
});

//TODO anpassen
SystemCalendar.NAME = "echo";
SystemCalendar.WEBSITE = "echo.silas.link";

DataManager._basePath = __HOST_ADDRESS__;
DataManager.onlineCallback = isOnline => {
    if (!isOnline) {
        console.log("not (yet) online!");
    }
};

Object.assign(BaseDatabase.CONNECTION_OPTIONS, {
    logging: ["error",],
    synchronize: false,
    migrationsRun: true,
    migrations: [
        SetupSchema1000000000000,
        SetupFavorite1000000000001,
        SetupUserManagement1000000001000,
        SetupEasySync1000000000500,
        FavoriteWithSystemCalendar1000000000002,
        FsjSchema1000000006000,
        AddRepeatedEvent1000000007000,
        FavoriteWithoutEventRelation1000000008000,
    ]
});

EasySyncClientDb.errorListener = async (e) => {
    console.error(e);
    await ClearDatabaseJob.doJob();
    debugger;
    //work with timeout since saving of db only occurs after 150ms in browser
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(window.location.reload(true));
        }, 200);
    });
};

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e)).then(() => {
    console.log("initialisation done!", new Date())
});
