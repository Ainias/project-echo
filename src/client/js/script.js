import translationGerman from '../translations/de.json';
import translationEnglish from '../translations/en.json';
import {App, StartSiteMenuAction, Translator, NavbarFragment, DataManager, MenuAction} from "cordova-sites";
import {Helper} from "js-helper/dist/shared"
import {EasySyncClientDb, SetupEasySync1000000000500, SyncJob} from "cordova-sites-easy-sync/dist/client";

import {WelcomeSite} from "./Sites/WelcomeSite";

import {Event} from "../../shared/model/Event";
import {Church} from "../../shared/model/Church";
import {Region} from "../../shared/model/Region";
import "./Model/Favorite"

import {BaseDatabase} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared";
import {ListChurchesSite} from "./Sites/ListChurchesSite";
import {AddEventSite} from "./Sites/AddEventSite";
import {UserManager, LoginSite, RegistrationSite, UserMenuAction} from "cordova-sites-user-management/dist/client";
import {CalendarSite} from "./Sites/CalendarSite";
import {ModifyChurchSite} from "./Sites/ModifyChurchSite";
import {ImpressumSite} from "./Sites/ImpressumSite";

import bibelverse from "./bibelverse.json";

//translation import
import "cordova-sites-user-management/dist/client/js/translationInit"
import "cordova-sites/dist/client/js/translationInit"
import logo from "../img/logo.png";

import {ModifyPostSite} from "./Sites/ModifyPostSite";
import {Post} from "../../shared/model/Post";
import {SetupSchema1000000000000} from "../../shared/model/migrations/SetupSchema";
import {SetupUserManagement1000000001000} from "cordova-sites-user-management/dist/shared/migrations/SetupUserManagement"
import {SetupFavorite1000000000001} from "../../shared/model/migrations/client/SetupFavorite";
import {FsjSchema1000000006000} from "../../shared/model/migrations/FsjSchema";
import {Fsj} from "../../shared/model/Fsj";
import {ModifyFsjSite} from "./Sites/ModifyFsjSite";
import {ListFsjsSite} from "./Sites/ListFsjsSite";
import {SystemCalendar} from "./SystemCalendar";
import {FavoriteWithSystemCalendar1000000000002} from "../../shared/model/migrations/client/FavoriteWithSystemCalendar";
import {SettingsSite} from "./Sites/SettingsSite";
import {RepeatedEvent} from "../../shared/model/RepeatedEvent";
import {AddRepeatedEvent1000000007000} from "../../shared/model/migrations/AddRepeatedEvent";
import {BlockedDay} from "../../shared/model/BlockedDay";
import {EventHelper} from "./Helper/EventHelper";
import {FavoriteWithoutEventRelation1000000008000} from "../../shared/model/migrations/client/FavoriteWithoutEventRelation";
import {ClearDatabaseJob} from "./ClearDatabase/ClearDatabaseJob";
import {CookieConsentHelper} from "./CookieConsent/CookieConsentHelper";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";
import {ImagesSchema1000000010000} from "../../shared/model/migrations/ImagesSchema";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";

window["JSObject"] = Object;
window["version"] = __VERSION__;


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
    // await SystemCalendar.createCalendar("echo");

    //Todo an richtige stelle auslagern
    let syncJob = new SyncJob();
    await syncJob.syncInBackgroundIfDataExists([Church, Event, Region, Post, Fsj, RepeatedEvent, BlockedDay, FileMedium]).catch(e => console.error(e));
    await syncJob.getSyncPromise().then(async res => {
        console.log("synched!");
        await EventHelper.updateFavorites(res["BlockedDay"]);
        EventHelper.updateNotificationsForEvents(res["Event"]["changed"]);
        EventHelper.deleteNotificationsForEvents(res["Event"]["deleted"]);
    });

    UserManager.getInstance().getMe().catch(e => console.error(e));

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

DataManager._basePath = __HOST_ADDRESS__+ "/api/v1/";
FileMedium.PUBLIC_PATH = __HOST_ADDRESS__ + "/uploads/img_";
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
        ImagesSchema1000000010000,
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

NativeStoragePromise.prefix = "functional_";
NativeStoragePromise.persistent = false;

let app = new App();
app.start(WelcomeSite).catch(e => console.error(e)).then(async () => {
    console.log("initialisation done!", new Date());

    //cookie compliance
    if (device.platform === "browser") {
        if (await CookieConsentHelper.mustAskForConsent()) {
            await CookieConsentHelper.showCookieDialog();
        } else {
            await NativeStoragePromise.makePersistent();
        }
    } else {
        if (await CookieConsentHelper.mustAskForConsent()) {
            await CookieConsentHelper.giveConsentToCookies(["functional", "statistic", "thirdParty"]);
        }
        if (await CookieConsentHelper.hasConsent("functional")) {
            await NativeStoragePromise.makePersistent();
        }
    }

    //For testing purposes
    window["queryDb"] = async (sql) => {
        let res = await EasySyncClientDb.getInstance().rawQuery(sql);
        console.log(res);
        return res;
    }
});
